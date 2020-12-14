#!/usr/bin/env node

const { promises: fs } = require('fs')
const path = require('path')

const paths = {
  root: path.resolve(__dirname, '..'),
  dist: path.resolve(__dirname, '..', 'dist'),
}

const targets = {
  node: 'node10.13',
  browser: ['chrome79', 'firefox78', 'safari13.1', 'edge79'],
}

const manifest = require('../package.json')
const unscopedPackageName = 'core'

const inputFile = require.resolve('..', manifest.main)
const tsconfig = path.resolve(paths.root, 'tsconfig.json')

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function main() {
  console.log(`Building bundle for ${path.relative(process.cwd(), inputFile)} ...`)

  await prepare()
  await Promise.all([copyFiles(), generateTypescriptDeclarations(), generateBundles()])

  await require('size-limit/run')(process)
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
          module: 'ESNext',
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
  const outputs = {
    // Used by nodejs
    node: {
      outfile: `./node/${unscopedPackageName}.js`,
      platform: 'node',
      target: targets.node,
      format: 'cjs',
      mainFields: ['esnext', 'es2015', 'module', 'main'],
    },
    esnext: {
      outfile: `./esnext/${unscopedPackageName}.js`,
      platform: 'browser',
      target: 'esnext',
      format: 'esm',
      mainFields: ['esnext', 'es2015', 'module', 'main'],
    },
    // Can be used from a normal script tag without module system.
    script: {
      outfile: `./script/${unscopedPackageName}.js`,
      platform: 'browser',
      target: 'es2017',
      format: 'iife',
      // TODO find a better global name
      globalName: 'tw_in_js',
      mainFields: ['esnext', 'es2015', 'module', 'main'],
      minify: true,
      external: false,
    },
    // Used by bundlers like rollup and cdn
    default: {
      outfile: `./module/${unscopedPackageName}.js`,
      platform: 'browser',
      target: targets.browser,
      format: 'esm',
      mainFields: ['esnext', 'es2015', 'module', 'main'],
      minify: true,
    },
  }

  const publishManifest = {
    ...manifest,

    // Define package loading
    // https://gist.github.com/sokra/e032a0f17c1721c71cfced6f14516c62
    exports: {
      ...manifest.exports,
      '.': {
        node: outputs.node.outfile,
        esnext: outputs.esnext.outfile,
        default: outputs.default.outfile,
        types: './types/index.d.ts',
      },

      // Allow access to all files (including package.json, ...)
      './': './',
    },

    // Used by nodejs
    main: outputs.node.outfile,

    // Used by carv cdn
    esnext: outputs.esnext.outfile,

    // Used by bundlers like rollup and cdns
    module: outputs.default.outfile,

    unpkg: outputs.script.outfile,

    // Typying
    types: './types/index.d.ts',

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

    // Reset bundledDependencies as esbuild includes those into the bundle
    bundledDependencies: undefined,
    bundleDependencies: undefined,

    // Reset config sections
    eslintConfig: undefined,
    prettier: undefined,
    np: undefined,
  }

  await fs.writeFile(
    path.join(paths.dist, 'package.json'),
    JSON.stringify(publishManifest, null, 2),
  )

  const external = Object.keys({
    ...manifest.dependencies,
    ...manifest.peerDependencies,
    ...manifest.devDependencies,
    ...manifest.optinonalDependencies,
  })

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
            sourcemap: 'external',
            // metafile: path.resolve(paths.build, `${outfile}.meta.json`),
            external: output.external === false ? undefined : external,
            tsconfig,
          })

          console.timeEnd(logKey)
        }),
    )
  } finally {
    service.stop()
  }
}
