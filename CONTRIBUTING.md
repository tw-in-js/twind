# Contributing to Twind

Thanks for checking out Twind! Please read on to learn how you can help make this project even better.

## Reporting Issues

Found a problem? Want a new feature?

- See if your issue or idea has [already been reported].
- Provide a [reduced test case] or a [live example].

Remember, a bug is a _demonstrable problem_ caused by _our_ code.

## Ways to help

Regardless of your experience level, there are ways that you can help:

- Share the project on Twitter
- Star the project on Github
- Tell your friends/co-workers about Twind
- Write an article about Twind on Medium, Dev, or your platform of choice
- Create written or video tutorials about Twind
- Report bugs or provide feedback by [creating issues](https://github.com/tw-in-js/twind)
- Contribute to the source code by fixing bugs/issues or helping us build new features

## How to create a good bug report

To be able to fix issues we need to see them on our machine. This is only possible when we can reproduce the error. The easiest way to do that is narrow down the problem to specific components or combination of them. This can be done by removing as much unrelated code as possible.

The perfect way to do that is to make a [codesandbox]. That way you can easily share the problematic code and ensure that others can see the same issue you are seeing.

For us a [codesandbox] says more than a 1000 words :tada:

## Documentation changes

All documentation for SvelteKit is in the `documentation` directory, and any improvements should be made as a Pull Request to this repository. The documentation is served via [an API](https://github.com/sveltejs/api.svelte.dev); the site itself is located in the [`sites` repository](https://github.com/sveltejs/sites).

If you wish to preview documentation changes locally, please follow the instructions here: [Previewing local docs changes](https://github.com/sveltejs/sites/blob/master/sites/kit.svelte.dev/README.md#previewing-local-docs-changes).

## Submitting Pull Requests

Pull requests are the greatest contributions, so be sure they are focused in scope and avoid unrelated commits.

- If adding a new feature:

  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:

  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `fix: update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

- It's OK to have multiple small commits as you work on the PR - GitHub can automatically squash them before merging.

- Make sure tests pass!

1. To begin: [fork this project], clone your fork, and add our upstream.

   ```sh
   # Clone your fork of the repo into the current directory
   git clone git@github.com:$(npx github-username-cli $(git config user.email))/twind.git

   # Navigate to the newly cloned directory
   cd twind

   # Assign the original repo to a remote called "upstream"
   git remote add upstream git@github.com:tw-in-js/twind.git
   ```

2. Local development

   The Twind repo is a monorepo using pnpm workspaces. The package manager used to install and link dependencies must be [pnpm](https://pnpm.io/).

   To develop and test a `twind` package:

   1. Run `pnpm install` in `twind`'s root folder

   2. Run `pnpm test` to run all tests

3. Create a branch for your feature or fix:

   ```sh
   # Move into a new branch for your feature
   git checkout -b feature/thing
   ```

   ```sh
   # Move into a new branch for your fix
   git checkout -b fix/something
   ```

4. Generating changelogs

   For changes to be reflected in package changelogs, run `pnpx changeset` and follow the prompts. All changesets should be `patch` until Twind 1.0

   ```sh
   pnpx changeset
   ```

5. If your code passes all the tests, then push your feature branch:

   ```sh
   # Test current code
   pnpm test # or npm test

   # Build current code
   pnpm build # or npm run build
   ```

   > Note: ensure your version of Node is 14 or higher to run scripts

   ```sh
   # Push the branch for your new feature
   git push origin feature/thing
   ```

   ```sh
   # Or, push the branch for your update
   git push origin update/something
   ```

That’s it! Now [open a pull request] with a clear title and description.

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

## Releases

The [Changesets GitHub action](https://github.com/changesets/action#with-publishing) will create and update a PR that applies changesets and publishes new versions of changed packages to npm.

> It uses `pnpm publish` rather than `pnpx changeset publish` so that we can use the `--filter` and (while in beta) `--tag` flags — though perhaps they work with `pnpx changeset publish`?

New packages will need to be published manually the first time if they are scoped to the `@twind` organisation, by running this from the package directory:

```bash
pnpm publish
```

## TODO

- how to contribute
- issues: templates on stackplitz, codesandbox, ...
- how to create a PR
  - https://codesandbox.io/docs/git
- changesets

[already been reported]: https://github.com/tw-in-js/twind/issues
[fork this project]: https://github.com/tw-in-js/twind/fork
[live example]: https://codesandbox.io/s/twind-bug-report-template-yfxpx
[codesandbox]: https://codesandbox.io/s/twind-bug-report-template-yfxpx
[open a pull request]: https://help.github.com/articles/using-pull-requests/
[reduced test case]: https://css-tricks.com/reduced-test-cases/
