// Based on https://github.com/tgreyuk/typedoc-plugin-markdown/blob/master/packages/typedoc-gitlab-wiki-theme/src/theme.ts
const fs = require('graceful-fs')
const readPkgUp = require('read-pkg-up')

const { RendererEvent, ReflectionKind } = require('typedoc')
const { MarkdownTheme } = require('typedoc-plugin-markdown')

exports.TwindTheme = class TwindTheme extends MarkdownTheme {
  /**
   * @param {import('typedoc').Renderer} renderer
   */
  constructor(renderer) {
    super(renderer)
    this.entryDocument = 'index.md'
    this.hideBreadcrumbs = true
    this.hidePageTitle = true
    this.namedAnchors = false
    this.hideInPageTOC = true
    // this.allReflectionsHaveOwnDocument = true
    this.listenTo(this.owner, {
      [RendererEvent.END]: this.onTwindRendererEnd,
    })
  }

  getRelativeUrl(url) {
    const relativeUrl = super
      .getRelativeUrl(url)
      .replace(/(.*).md/, '$1')
      .replace(/ /g, '-')
      .replace(/\/index$/, '')
    return relativeUrl.startsWith('..') ? relativeUrl : './' + relativeUrl
  }

  /**
   * @param {any} mapping
   * @param {DeclarationReflection} reflection
   * @returns {string}
   */
  toUrl(mapping, reflection) {
    return `${mapping.directory}/${reflection
      .getFullName()
      .replace(/\s+/g, '-')
      .replaceAll(
        '.',
        reflection.kind === ReflectionKind.Module || reflection.kind === ReflectionKind.Namespace
          ? '/'
          : '~',
      )}.md`
  }

  get mappings() {
    return [
      {
        kind: [ReflectionKind.Module],
        isLeaf: false,
        directory: '.',
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Namespace],
        isLeaf: false,
        directory: '.',
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Enum],
        isLeaf: false,
        directory: '.',
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Class],
        isLeaf: false,
        directory: '.',
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Interface],
        isLeaf: false,
        directory: '.',
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.TypeAlias],
        isLeaf: true,
        directory: '.',
        template: this.getReflectionMemberTemplate(),
      },
      //   {
      //     kind: [ReflectionKind.Variable],
      //     isLeaf: true,
      //     directory: '.',
      //     template: this.getReflectionMemberTemplate(),
      // },
      // {
      //     kind: [ReflectionKind.Function],
      //     isLeaf: true,
      //     directory: '.',
      //     template: this.getReflectionMemberTemplate(),
      // },
    ]
  }

  getReflectionTemplate() {
    const tpl = super.getReflectionTemplate()

    return (pageEvent) => {
      const otherSections = []

      const md =
        tpl(pageEvent)
          // remove everything until first header
          .replace(/[\s\S]+?#/m, '#')
          // we are using Namespaces for sub-path exports
          .replace(/^## Namespaces$/m, '## Subpath Exports')
          .replace(/__namedParameters/g, '...«destructured»')
          // move all enums, interfaces, and type aliases to the bottom of the page
          .replace(/^## (Enums|Classes|Interfaces|Type Aliases)$([\s\S]+?)(?=##)/gim, (_) => {
            otherSections.push(_)
            // '<details><summary>$1</summary>$2</details>\n\n'
            return ''
          }) +
        '\n\n' +
        otherSections.join('\n\n')

      const isPackage = pageEvent.model.kind === ReflectionKind.Module
      const isSubpath = pageEvent.model.parent && pageEvent.model.kind === ReflectionKind.Namespace

      const pkg =
        isPackage &&
        pageEvent.model.sources.length &&
        readPkgUp.sync({ cwd: pageEvent.model.sources[0].fullFileName, normalize: false })

      const fullName = isSubpath
        ? `${pageEvent.model.parent.getFullName()}/${pageEvent.model.name}`
        : !isPackage && pageEvent.model.parent
        ? `${pageEvent.model.parent.getFullName()} › ${pageEvent.model.name}`
        : pageEvent.model.getFullName()

      const packageName = isPackage
        ? pageEvent.model.getFullName()
        : isSubpath && pageEvent.model.parent.getFullName()

      const frontMatter = [
        `section: Packages`,
        `title: ${JSON.stringify(fullName)}`,
        // `label: ${JSON.stringify(fullName)}`,
        packageName && `package: ${JSON.stringify(packageName)}`,
        pkg &&
          pkg.packageJson.description &&
          `excerpt: ${JSON.stringify(pkg.packageJson.description)}`,
        `nav: ${isPackage}`,
        `editLink: false`,
      ]
        .filter(Boolean)
        .join('\n')

      // console.debug({ pageEvent, frontMatter })

      return [`---`, frontMatter, `---`, md].join('\n')
    }
  }

  getReflectionMemberTemplate() {
    const tpl = super.getReflectionMemberTemplate()

    return (pageEvent) => {
      const md = tpl(pageEvent).replace(/__namedParameters/g, '...«destructured»')

      const fullName = pageEvent.model.parent
        ? `${pageEvent.model.parent.getFullName()} › ${pageEvent.model.name}`
        : pageEvent.model.getFullName()

      const frontMatter = [
        `section: Packages`,
        `title: ${JSON.stringify(fullName)}`,
        // `label: ${JSON.stringify(fullName)}`,
        `nav: false`,
        `editLink: false`,
      ]
        .filter(Boolean)
        .join('\n')

      // console.debug({ pageEvent, frontMatter })

      return [`---`, frontMatter, `---`, md].join('\n')
    }
  }

  /**
   * @param {RendererEvent} renderer
   * @returns {void}
   */
  onTwindRendererEnd(renderer) {
    const getRelativeUrl = (url) => this.getRelativeUrl(url).replace(/^\.?\.\//, '/packages/')
    const isPackageLike = (navItem) => navItem.title === 'Modules' || navItem.title === 'Namespaces'

    const modules = (
      this.getNavigation(renderer.project)
        .children?.filter(isPackageLike)
        .flatMap((navItem) =>
          navItem.children?.map(
            (navItemChild) =>
              `${navItem.title === 'Namespaces' ? '  ' : ''}- [${navItemChild.title.replaceAll(
                '.',
                '/',
              )}](${getRelativeUrl(navItemChild.url)})`,
          ),
        ) || []
    )
      .sort((first, second) => {
        // sort subpackage exports after the package
        const a = first.replace(/^[^[]+\[([^[]+)].+$/, '$1')
        const b = second.replace(/^[^[]+\[([^[]+)].+$/, '$1')
        const packageA = a.replace(/^((?:@[^/]+\/)?[^/]+)(?:\/.+)?$/, '$1')
        const packageB = b.replace(/^((?:@[^/]+\/)?[^/]+)(?:\/.+)?$/, '$1')

        let order = packageA.localeCompare(packageB)

        if (!order) {
          const subPathA = a.replace(/^(?:(?:@[^/]+\/)?[^/]+)(\/.+)?$/, '$1')
          const subPathB = a.replace(/^(?:(?:@[^/]+\/)?[^/]+)(\/.+)?$/, '$1')
          order = subPathA.localeCompare(subPathB)
        }

        return order
      })
      .join('\n')

    const frontMatter = [
      `---`,
      `section: Packages`,
      `title: Overview`,
      `description: Index of all available twind packages.`,
      `nav: false`,
      `editLink: false`,
      `---`,
    ].join('\n')

    fs.writeFileSync(
      renderer.outputDirectory + '/' + this.entryDocument,
      [frontMatter, modules].join('\n\n'),
    )
  }

  get globalsFile() {
    return this.entryPoints.length > 1 ? this.entryDocument : 'Exports.md'
  }
}
