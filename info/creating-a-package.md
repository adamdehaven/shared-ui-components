# Creating a package

> Note: Docs are a work in-progress

## Contents

- [Creating a package](#creating-a-package)
  - [Contents](#contents)
  - [Create a new package directory](#create-a-new-package-directory)
  - [Include a `package.json` file](#include-a-packagejson-file)
    - [`dependencies`](#dependencies)
    - [`peerDependencies`](#peerdependencies)
    - [`devDependencies`](#devdependencies)
    - [`scripts`](#scripts)
    - [`publishConfig`](#publishconfig)
  - [Include `tsconfig` files](#include-tsconfig-files)
    - [`tsconfig.json`](#tsconfigjson)
  - [Include a `README.md` file](#include-a-readmemd-file)
  - [Implement your package within a `src/` directory](#implement-your-package-within-a-src-directory)
    - [Unit Tests](#unit-tests)
    - [Component Tests](#component-tests)
  - [Integrate with CI](#integrate-with-ci)
    - [Publishing](#publishing)
  - [Update `CODEOWNERS`](#update-codeowners)
  - [Update Dependabot Config](#update-dependabot-config)

## Create a new package directory

Create a new directory for your package within the `packages/` directory of this repository.
The name of the directory _should_ match the NPM package name defined in `package.json` (without the scope).
Example: `@kong-ui/my-awesome-component` NPM package should live in the directory `packages/my-awesome-component`.

## Include a `package.json` file

Please consult the `package.json` files that are already within existing packages for a complete example.
Some important fields to consider when adding your `package.json` are:

### `dependencies`

Make sure to include all explicitly versioned runtime dependencies within this section. Packages that integrate or augment JS frameworks should not include the core framework dependencies in this section. Instead, these should be defined in [`peerDependencies`](#peerdependencies)

#### Depedencies on packages also managed within this monorepo

Add the dependency to your `package.json` file by package name using the _latest_ package version (as defined in its own `package.json` file). For example, if you are developing `@kong-ui/new-foo` and `@kong-ui/foo` already exists as a package within `shared-js`, add the following to the `package.json` file of `@kong-ui/new-foo`:

```json
"dependencies": {
  "@kong-ui/foo": "0.6.2"
}
```

where `0.6.2` is the version that's currently listed in the `package.json` file of `@kong-ui/foo` within the `shared-js` repo.

During local development, the local version of `@kong-ui/foo` will be symlinked and used within `@kong-ui/new-foo`.
During our release automation, Lerna will ensure that the version of `@kong-ui/foo` required in the `package.json` of `@kong-ui/new-foo` is kept up-to-date. That is, when a new version of `@kong-ui/foo` is released the `package.json` file of `@kong-ui/new-foo` is also updated and thus a new version of `@kong-ui/new-foo` is released.

### `peerDependencies`

Include loosely bounded (SemVer-wise) peer deps, i.e. `react` or `@nestjs/core`

### `devDependencies`

`devDependencies` should be empty or not defined at all within your `package.json` (with some exception). Please define `devDependencies` within the monorepo root `package.json` file, for example:

```bash
 pnpm add -wD @types/foo
```

### `scripts`

The following scripts should be defined within your package so that it's properly integrated within the monorepo development cycle (and CI/CD):

- `dev` to run the local sandbox of your component utilizing the files within the local `/sandbox/*` directory.
- `build` to compile/transpile your package into a `dist/` artifact
- `lint` to validate your code style/formatting via ESLint
- `lint:fix` to automatically resolve basic code style/formatting issues with ESLint
- `typecheck` to validate typecheck the code

Your `scripts` section may also contain as many additional scripts as you'd like. However, please note that:

> All `scripts` MUST be executed from the root context of the monorepo

So, if you wanted to run lint the code in your package defined as the `lint` script command for a package named `@kong-ui/foo` you would run:

```bash
pnpm --filter "@kong-ui/foo" run lint

# OR

lerna run lint --scope "@kong-ui/foo"
```

<!--
### `publishConfig`

The `publishConfig` field is important as it marks the package as private for the given organization scope (i.e. `@kong-ui/`) and leverages pnpm features to rewrite the `main` and `typings` fields at time of publish. It should look something like:

```json
"publishConfig": {
  "access": "restricted",
  "main": "dist/index.js",
  "typings": "dist/index.d.ts"
}
``` -->

### `files`

The [`files`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files) field specifies which files will be included in the published NPM package (note that some files are automatically included, see NPM docs). In general this should refer to at least the `dist/` directory, relative to the published package directory:

```json
"files": ["dist"]
```

## Include `tsconfig` files

Please consult the `tsconfig.json` file that is already within existing packages for a complete example.

### `tsconfig.json`

Each package MUST have a `tsconfig.json` file that extends the monorepo root `tsconfig.json`. This file can add/override Typescript compiler options as needed by the package. The minimum required `tsconfig.json` looks like:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "outDir": "dist",
    "declarationDir": "dist/types"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "sandbox",
    "**/*.spec.ts",
    "**/*.cy.ts"
  ]
}
```

## Include a `README.md` file

Each package SHOULD include a `README.md` file at the root of its package directory. This file should provide installation/usage documentation for consumers of the package. This file should be akin to the root `README` file that would exist if the package was a standalone Git repository.

The one exception is the `Development` section of the README. It is acceptable to omit that section or include a link/reference to the `Development` section of the monorepo root.

## Implement your package within a `src/` directory

All Vue and Typescript source code for your package should live within the `src/` directory of your package.

### Unit Tests

By convention, all unit tests MUST be included in the `src/` directory and follow the `*.spec.ts` filename pattern. A unit test can be defined as any test that does not require a visual UI running. An example of something you would write a Unit Test for would be a composable function or code within the `@kong-ui/utils` package. Unit tests are run via [Vitest](https://vitest.dev/).

### Component Tests

By convention, component tests MUST be included in the `src/` directory and follow the `*.cy.ts` filename pattern. A component test can be defined as any test that DOES require a visual UI running. All components within this monorepo should have good component test coverage. Component tests are run via [Cypress Component Test Runner](https://docs.cypress.io/guides/component-testing/writing-your-first-component-test).

## Integrate with CI

By following this guide, CI integration should happen automatically. That is, your package will have the following out-of-the-box:

- Dependency Installation
- Linting & Code Validation
- Build
- Component & Unit Tests
- [Publishing](#publishing)

### Publishing

Please reference the in-depth package publishing documentation [here](./package_publishing.md).

## Update `CODEOWNERS`

Please update the `CODEOWNERS` file at the root of the repository so that it includes your new package and specifies code owners for the package. This way, the code owners specified will automatically be added as reviewers to PRs that make contributions to your package.

Refer to the [Github Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) on `CODEOWNERS` for more information.

## Update Dependabot Config

[Dependabot](https://docs.github.com/en/code-security/dependabot) is used to keep repo/package dependencies up-to-date. Because of limitations in how Dependabot is currently configured, the script [`generate-dependabot-config.ts`](../scripts/generate-dependabot-config.ts) is used to autogenerate the configuration.

When adding a new package, simply run:

```bash
pnpm run generate-dependabot-config
```

and then check in the updated configuration file ([`dependabot.yml`](../.github/dependabot.yml)).
