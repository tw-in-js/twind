# Packages

This folder contains all the packages that are published to npm.

## How to add a package

- [ ] add folder and make sure it's a unique "name" field in `package.json` following these conventions:
  - for presets: `@twind/preset-<name>`
  - for integrations: `@twind/with-<name>` _except_ there is a specific naming convention like `<name>-plugin-twind`
- [ ] add to link in [`CHANGELOG.md`](../CHANGELOG.md)
- [ ] add to `publishDirectory` in [`.codesandbox/ci.json`](../.codesandbox/ci.json)
- [ ] add an example to [`examples`](../examples)
- [ ] add a documentation page [`website/pages/docs`](../website/pages/docs) with the following frontmatter:
  - for presets: `section: Presets`
  - for integrations: `section: Twind with`
