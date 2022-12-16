# ui-shared-components

> **Note**: Docs are a work in-progress

Monorepo for internally-published Vue components

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

- [What goes here](#what-goes-here)
- [Creating a package](#creating-a-package)
- [Development](#development)
  - [Setup](#setup)
  - [Dev Server](#dev-server)
  - [ESLint](#eslint)
  - [Type Checking](#type-checking)
  - [Testing](#testing)
  - [Preview sandbox build](#preview-sandbox-build)
  - [Build for production](#build-for-production)
  - [Requirements](#requirements)
  - [Committing Changes](#committing-changes)
- [Preview components](#preview-components)
- [Running consuming application with local copy of the package](#running-consuming-application-with-local-copy-of-the-package)

## What goes here

Here are some criteria to help figure out if your code belongs to this mono-repository. If all of the following are true, you are welcome to create a new package:

- You are creating component(s) that may have some business domain-specific logic or internal Kong/Konnect look-and-feel, and you do not want to expose in our public [Kongponents component library](https://github.com/Kong/kongponents).
- You are writing component/code that is to be used in multiple applications (e.g. Konnect and Konnect Admin, or Konnect and Mesh, etc.).
- Your code is about UI. If you are wring the code to be used on the backend, then [shared-js](https://github.com/Kong/shared-js) is the better choice.


## Creating a package

[View the guide on creating a new package within the monorepo here](./docs/creating-a-package.md)

## Development

All packages must be created utilizing the `pnpm run create-package` CLI. [See here for more details.](./docs/creating-a-package.md#required-use-the-provided-cli-to-scaffold-your-new-package)

### Setup

To get started, install dependencies

```sh
pnpm install
```

Next, make sure all dependent packages (from the monorepo itself) are built and available

```sh
pnpm run build
```

You can also run `pnpm install-autocomplete` to integrate `pnpm` autocompletion into your command line tools.

### Dev Server

Run the dev server in your `packages/{package-name}/sandbox/` directory with hot-module reload

```sh
pnpm --filter "@kong-ui/{package-name}" run dev
```

### ESLint

Lint package files

```sh
# Lint only
pnpm --filter "@kong-ui/{package-name}" run lint

# Lint and fix
pnpm --filter "@kong-ui/{package-name}" run lint:fix
```

### Type Checking

Type check your package

```sh
pnpm --filter "@kong-ui/{package-name}" run typecheck
```

### Testing

Run Component or Unit tests

```sh
# Component tests
pnpm --filter "@kong-ui/{package-name}" run test:component

# Component tests (with UI)
pnpm --filter "@kong-ui/{package-name}" run test:open

# Unit tests
pnpm --filter "@kong-ui/{package-name}" run test:unit

# Unit tests (with UI)
pnpm --filter "@kong-ui/{package-name}" run test:unit:open
```

### Preview sandbox build

Build your `packages/{package-name}/sandbox/` directory for production and serve locally

```sh
pnpm --filter "@kong-ui/{package-name}" run preview
```

### Build for production

```sh
pnpm --filter "@kong-ui/{package-name}" run build
```

### Requirements

- [NodeJS >= 18.x](https://nodejs.org/en/download/)
- [pnpm 7.x](https://pnpm.io/installation) ([_Why pnpm?_](./docs/why-pnpm.md))
- Kong npm registry token available as `NPM_TOKEN` in your shell environment ([_More info_](./docs/kong-npm-token-setup.md))

It is recommended to also _globally_ install [`lerna`](https://lerna.js.org/) with `pnpm` (though not absolutely required)

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

You are working on the PR and changing component project. Let's say `@kong-ui/forms`. You want to try to deploy consuming application (`khcp-ui` for example) that uses your changed code without merging your changes to main and publishing new version of @kong-ui/forms. Here are the steps:

1. Look at your PR where your changes for @kong-ui/forms. Every time PR is getting build, tarball preview of package is getting deployed, and there is PR comment created:

```text
Preview components from this PR in consuming application

In consuming application project install preview versions of shared packages by running following commands:

yarn add "@kong-ui/forms@https://pr-212--ui-shared-components.netlify.app/kong-ui-forms-0.4.5-395a8bc.tgz"

```

install the tarball version of the package using command provided in the PR in consuming application, let that PR be deployed, and see PR preview of consuming application utiizing @kong-ui/forms code from your branch.


## Running consuming application with local copy of the package

You are developing shared component (let's say `@kong-ui/forms`) and you need to run consuming application `khcp-ui` with the current version of the code you have locally in your ui-shared-components/packages/forms branch. Here is how to do it:

1. in the folder `ui-shared-components/packages/forms` run

    ```sh
    yarn link
    ```

1. make sure your package is getting build in watch mode, for this in in the folder `ui-shared-components/packages/forms` run:

    ```sh
    pnpm build:package --watch
    ```

1. In the root folder of `khcp-ui` application run:

    ```sh
    yarn link "@kong-ui/forms"
    ```

1. Run your consuming application as usual and enjoy your forms code changes visible in your local env immediately.

    ```sh
    yarn run dev
    ```

In some cases HMR (hot module reloading) is not working out of the box in this configuration, to force it you might need following changes in `vite.config.ts` of consuming application:

1. add `watch: ignored` into the `server` config:

    ```ts
      server: {
          watch: {
            ignored: ['!**/node_modules/@kong-ui/forms/**']
          },
    ```

1. add `optimizeDeps` into the root of the config:

    ```ts
        optimizeDeps: {
          exclude: ['@kong-ui/forms']
        },
    ```

    _Please do not commit these changes_

    And finally, when you done working with local (linked copy) of youe ui-shared package, unlink it:

1. In the folder `ui-shared-components/packages/forms` run

    ```sh
    yarn unlink
    ```

1. In the root folder of `khcp-ui` application run:

    ```sh
    yarn unlink "@kong-ui/forms"
    yarn install --force --frozen-lockfile
    ```

