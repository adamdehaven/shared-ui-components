# ui-shared-components

> **Note**: Docs are a work in-progress

Monorepo for internally-published Vue components

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

- [Creating a package](#creating-a-package)
- [Development](#development)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Committing Changes](#committing-changes)
- [Preview components](#preview-components)

## Creating a package

View the guide on creating a new package within the monorepo [here](./docs/creating-a-package.md)

## Development

> **Note**: more info to come

All packages must be created utilizing the `pnpm run create-package` CLI. [See here for more details.](./docs/creating-a-package.md#required-use-the-provided-cli-to-scaffold-your-new-package)

### Requirements

- [NodeJS >= 16.x](https://nodejs.org/en/download/)
- [pnpm 7.x](https://pnpm.io/installation) ([_Why pnpm?_](./docs/why-pnpm.md))
- Kong npm registry token available as `NPM_TOKEN` in your shell environment ([_More info_](./docs/kong-npm-token-setup.md))

It is recommended to also _globally_ install [`lerna`](https://lerna.js.org/) with `pnpm` (though not absolutely required)

### Setup

1. Install Dependencies

```sh
pnpm install
```

### Committing Changes

This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). [Commitizen](https://github.com/commitizen/cz-cli) and [Commitlint](https://github.com/conventional-changelog/commitlint) are used to help build and enforce commit messages.

It is **highly recommended** to use the following command in order to create your commits:

```sh
pnpm commit
```

For more information on different components that compose our commit messages, please reference the [Package Publishing docs](./docs/package-publishing.md#conventional-commits)

#### Enforcing Commit Format

[Lefthook](https://github.com/evilmartians/lefthook) is used to manage Git Hooks within the repo.

- A `commit-msg` hook is automatically setup that enforces commit message stands with `commitlint`, see [`lefthook.yml`](./lefthook.yaml)
- A `pre-push` hook is used that runs `eslint` before allowing you to push your changes to the repository

Additionally, CI will use `commitlint` to validate the commits associated with a PR in the `Lint and Validate` job.

## Preview components

If your package components are already consumed by **Konnect** (`Kong/khcp-ui`) and you are working on the fix/change for this component - you can preview how your version of the component is acting in existing **Konnect DEV** environment or in **Konnect PR previews**.

- Create your branch of and PR preview in this repository, do your code changes.
- Open <https://cloud.konghq.tech> or your Konnect Development preview URL with `pkgdomain=pr-<N>--ui-shared-components` query string (where <N> - ui-shared-components PR number).

konnect will pull preview of component build in your PR and use it.
