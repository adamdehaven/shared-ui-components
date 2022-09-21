# Package Publishing

## Contents

- [Package Publishing](#package-publishing)
  - [Contents](#contents)
  - [Conventional Commits](#conventional-commits)
  - [Versioning](#versioning)
  - [Publishing](#publishing)
  - [Automation in CI](#automation-in-ci)

## Conventional Commits

## Versioning

## Publishing

Publishing versioned packages is actually a very simple task. From the monorepo root run:

```bash
pnpm run publish
```

This command will run the [`pnpm publish`](https://pnpm.io/cli/publish) command recursively in all packages. Fortunately, the command is smart and will compare the semver contained in each package's `package.json` at `HEAD` against the latest semver of the package that's published to the NPM registry. If the package version is not already published, `pnpm` will publish the new package version to the registry. Otherwise, the package is skipped.

## Automation in CI
