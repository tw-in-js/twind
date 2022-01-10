# Contributing to Twind

Thanks for checking out Twind! Please read on to learn how you can help make this project even better.

## Ways to help

Regardless of your experience level, there are ways that you can help:

- Share the project on Twitter
- Star the project on Github
- Tell your friends/co-workers about Twind
- Write an article about Twind on Medium, Dev, or your platform of choice
- Create written or video tutorials about Twind
- Report bugs or provide feedback by [creating issues](https://github.com/tw-in-js/twind)
- Contribute to the source code by fixing bugs/issues or helping us build new features

## Ideas

If you think anything here sounds like a good idea and/or would like to make it happen, please [file an issue](https://github.com/tw-in-js/twind) and let us know!

## How to create a good bug report

To be able to fix issues we need to see them on our machine. This is only possible when we can reproduce the error. The easiest way to do that is narrow down the problem to specific components or combination of them. This can be done by removing as much unrelated code as possible.

The perfect way to do that is to make a [codesandbox](https://codesandbox.io/). That way you can easily share the problematic code and ensure that others can see the same issue you are seeing.

For us a [codesandbox](https://codesandbox.io/) says more than a 1000 words :tada:

## Local development

The Twind repo is a monorepo using pnpm workspaces. The package manager used to install and link dependencies must be [pnpm](https://pnpm.io/).

To develop and test a `twind` package:

1. Run `pnpm install` in `twind`'s root folder

2. Run `pnpm test` to run all tests

<details>

<summary>We recommend installing <a href="https://github.com/antfu/ni" rel="external">ni</a> to help switching between repos using different package managers.</summary>

`ni` also provides the handy `nr` command which running npm scripts easier:

- `ni` is equivalent to `pnpm install`
- `nr test` is equivalent to `pnpm run test`

</details>

### Testing Twind against external packages

You may wish to test your locally-modified copy of Twind against another package that is using it. For pnpm, after building Twind, you can use [`pnpm.overrides`](https://pnpm.io/package_json#pnpmoverrides). Please note that `pnpm.overrides` must be specified in the root `package.json` and you must first list the package as a dependency in the root `package.json`:

```json
{
  "dependencies": {
    "twind": "*"
  },
  "pnpm": {
    "overrides": {
      "twind": "link:../path/to/twind/packages/twind"
    }
  }
}
```

And re-run `pnpm install` to link the package.

## Pull Request Guidelines

- Checkout a topic branch from a base branch, e.g. `main`, and merge back against that branch.

- If adding a new feature:

  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:

  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `fix: update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

- It's OK to have multiple small commits as you work on the PR - GitHub can automatically squash them before merging.

- Make sure tests pass!

- Commit messages must follow the [commit message convention](./.github/commit-convention.md) so that changelogs can be automatically generated.

## TODO

- how to contribute
- issues: templates on stackplitz, codesandbox, ...
- how to create a PR
  - https://codesandbox.io/docs/git
- changesets
