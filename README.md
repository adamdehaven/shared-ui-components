# ui-shared-components

> Monorepo for internally published Vue components

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Table of Contents

- [ui-shared-components](#ui-shared-components)
  - [Table of Contents](#table-of-contents)
  - [Repo Structure](#repo-structure)
  - [Development](#development)
    - [Requirements](#requirements)
    - [Setup](#setup)
    - [Committing Changes](#committing-changes)

## Repo Structure

## Development

### Requirements

- [NodeJS >= 16.x](https://nodejs.org/en/download/)
- [pnpm 7.x](https://pnpm.io/installation) ([_Why pnpm?_](./docs/why_pnpm.md))
- Kong npm registry token available as `NPM_TOKEN` in your shell environment ([_More info_](./docs/kong_npm_token_setup.md))

It is recommended to also _globally_ install [`lerna`](https://lerna.js.org/) with `pnpm` (though not absolutely required)

### Setup

1. Install Dependencies

```sh
pnpm install
```

### Committing Changes

This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). [Commitizen](https://github.com/commitizen/cz-cli) and [Commitlint](https://github.com/conventional-changelog/commitlint) are used to help build and enforce commit messages.

It is __highly recommended__ to use the following command in order to create your commits:

```sh
pnpm commit
```

For more information on different components that compose our commit messages, please reference the [Package Publishing docs](./docs/package_publishing.md#conventional-commits)

#### Enforcing Commit Format

[Lefthook](https://github.com/evilmartians/lefthook) is used to manage Git Hooks within the repo. A `commit-msg` hook is automatically setup that enforces commit message stands with `commitlint`, see [`lefthook.yml`](./lefthook.yml).

Additionally, CI will use `commitlint` to validate the commits associated with a PR in the `Lint and Validate` job.
