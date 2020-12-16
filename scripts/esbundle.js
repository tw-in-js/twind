#!/usr/bin/env node

const { existsSync, promises: fs } = require('fs')
const path = require('path')

const paths = {
  root: path.resolve(__dirname, '..'),
  dist: path.resolve(__dirname, '..', 'dist'),
}

const manifest = require(path.resolve(paths.root, 'package.json'))

const packageName = manifest.name.replace('@', '').replace('/', '_')
const globalName = manifest.globalName || manifest.name.replace('@', '').replace('/', '.')

const inputFile = path.resolve(paths.root, manifest.source || manifest.main)
const tsconfig = path.resolve(paths.root, 'tsconfig.json')

const useTypescript = existsSync(tsconfig)

const targets = {
  node: 'node10.13',
  browser: ['chrome79', 'firefox78', 'safari13.1', 'edge79'],
}

const external = Object.keys({
  ...manifest.dependencies,
  ...manifest.peerDependencies,
  ...manifest.devDependencies,
  ...manifest.optinonalDependencies,
})

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function main() {
  console.log(`Building bundle for ${path.relative(process.cwd(), inputFile)} ...`)

  await prepare()
  await Promise.all([
    copyFiles(),
    useTypescript && generateTypescriptDeclarations(),
    generateBundles(),
  ])

  if (manifest['size-limit']) {
    await require('size-limit/run')(process)
  }
}

async function prepare() {
  // Cleanup old build
  await fs.rmdir(paths.dist, { recursive: true, force: true })

  // Copy files
  await fs.mkdir(paths.dist)
}

async function copyFiles() {
  console.time('Copied common files')

  await Promise.all(
    ['LICENSE', 'README.md'].map((file) =>
      fs.copyFile(path.resolve(paths.root, file), path.resolve(paths.dist, file)),
    ),
  )

  console.timeEnd('Copied common files')
}

async function generateTypescriptDeclarations() {
  // generate typescript definitions
  const execa = require('execa')

  console.time('Generated typescript declarations')

  const config = path.resolve(path.dirname(tsconfig), 'tsconfig.dist.json')

  await fs.writeFile(
    config,
    JSON.stringify(
      {
        extends: './' + path.basename(tsconfig),
        exclude: ['**/__fixtures__/**', '**/__tests__/**'],
        compilerOptions: {
          target: 'ESNext',
          module: manifest.browser === false ? 'CommonJS' : 'ESNext',
          emitDeclarationOnly: true,
          noEmit: false,
          outDir: path.resolve(paths.dist, 'types'),
        },
      },
      null,
      2,
    ),
  )

  try {
    // tsc --project tsconfig.dist.json
    await execa('tsc', ['--project', config], {
      cwd: paths.root,
      extendEnv: true,
      stdout: 'inherit',
      stderr: 'inherit',
    })
  } finally {
    await fs.unlink(config)
  }

  console.timeEnd('Generated typescript declarations')
}

async function generateBundles() {
  const outputs = {}

  if (manifest.browser !== true) {
    Object.assign(outputs, {
      // Used by nodejs
      node: {
        outfile: `./node/${packageName}.js`,
        platform: 'node',
        target: targets.node,
        format: 'cjs',
      },
    })
  }

  if (manifest.browser !== false) {
    Object.assign(outputs, {
      esnext: {
        outfile: `./esnext/${packageName}.js`,
        platform: 'browser',
        target: 'esnext',
        format: 'esm',
      },
      // Can be used from a normal script tag without module system.
      script: {
        outfile: `./script/${packageName}.js`,
        platform: 'browser',
        target: 'es2017',
        format: 'iife',
        globalName,
        minify: true,
        external: false,
      },
      // Used by bundlers like rollup and cdn
      default: {
        outfile: `./module/${packageName}.js`,
        platform: 'browser',
        target: targets.browser,
        format: 'esm',
        minify: true,
      },
    })
  }

  const publishManifest = {
    ...manifest,

    // Define package loading
    // https://gist.github.com/sokra/e032a0f17c1721c71cfced6f14516c62
    exports: {
      ...manifest.exports,
      '.': {
        node: outputs.node && outputs.node.outfile,
        esnext: outputs.esnext && outputs.esnext.outfile,
        default: outputs.default ? outputs.default.outfile : outputs.node.outfile,
      },

      // Allow access to all files (including package.json, ...)
      './': './',
    },

    // Used by nodejs
    main: outputs.node ? outputs.node.outfile : outputs.default.outfile,

    // Used by carv cdn
    esnext: outputs.esnext && outputs.esnext.outfile,

    // Used by bundlers like rollup and cdns
    module: outputs.default && outputs.default.outfile,

    unpkg: outputs.script && outputs.script.outfile,

    types: useTypescript ? './types/index.d.ts' : undefined,

    // Some defaults
    sideEffects: false,

    // Allow publish
    private: undefined,

    // Include all files in the dist folder
    files: undefined,

    // Default to cjs
    type: undefined,

    // These are not needed any more
    source: undefined,
    scripts: undefined,
    devDependencies: undefined,
    optionalDependencies: undefined,

    // Reset bundledDependencies as esbuild includes those into the bundle
    bundledDependencies: undefined,
    bundleDependencies: undefined,

    // Reset config sections
    eslintConfig: undefined,
    prettier: undefined,
    np: undefined,
    'size-limit': undefined,

    // Resets comments
    '//': undefined,
  }

  await fs.writeFile(
    path.join(paths.dist, 'package.json'),
    JSON.stringify(publishManifest, null, 2),
  )

  const service = await require('esbuild').startService()

  try {
    await Promise.all(
      Object.entries(outputs)
        .filter(([, output]) => output)
        .map(async ([, output]) => {
          const outfile = path.resolve(paths.dist, output.outfile)

          const logKey = `Bundled ${path.relative(process.cwd(), outfile)} (${output.format} - ${
            output.target
          })`
          console.time(logKey)

          await service.build({
            ...output,
            outfile,
            entryPoints: [inputFile],
            charset: 'utf8',
            resolveExtensions: ['.tsx', '.ts', '.jsx', '.mjs', '.js', '.cjs', '.css', '.json'],
            bundle: true,
            external: output.external === false ? undefined : external,
            mainFields: ['esnext', 'es2015', 'module', 'main'],
            sourcemap: 'external',
            tsconfig,
          })

          console.timeEnd(logKey)
        }),
    )
  } finally {
    service.stop()
  }
}
