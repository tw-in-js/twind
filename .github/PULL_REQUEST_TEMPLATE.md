You might find our contributing section about [Submitting Pull Requests](https://github.com/tw-in-js/twind/blob/next/CONTRIBUTING.md#submitting-pull-requests) helpful.

### Please don't delete this checklist! Before submitting the PR, please make sure you do the following:

- [ ] It's really useful if your PR references an issue where it is discussed ahead of time. In many cases, features are absent for a reason.
- [ ] This message body should clearly illustrate what problems it solves.
- [ ] Ideally, include a test that fails without this PR but passes with it.

### Tests

- [ ] Run the tests with `pnpm test` and verify the project with `pnpm check`

### Changesets

- [ ] If your PR makes a change that should be noted in one or more packages' changelogs, generate a changeset by running `pnpx changeset` and following the prompts. All changesets should be `patch` until Twind 1.0
