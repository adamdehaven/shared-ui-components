import fs from 'fs'
import path from 'path'
import { sleep, packagePath, pascalCase, packageTemplatePath, getTemplateFileList } from '.'
import { createSpinner, Spinner } from 'nanospinner'
import pc from 'picocolors'
import boxen from 'boxen'
import emoji from 'node-emoji'
import inquirer, { Answers } from 'inquirer'
import questions from '../questions'

const { packageName, confirmPackageName } = questions

/**
 * @description Create new files for package
 * @param {string} packageName Package name
 * @return {*}
 */
const createPackageFiles = async (packageName: string): Promise<void> => {
  const spinner: Spinner = createSpinner('Creating new package...').start()
  await sleep()

  const componentName = pascalCase(packageName) // e.g. DemoComponent

  //
  // SOURCE FILES
  // =========================
  const packageFilesTemplatePath = packageTemplatePath()
  const packageFilesToCreate = await getTemplateFileList(packageFilesTemplatePath)

  // Check to ensure packages/{packageName} directory does not already exist
  if (fs.existsSync(packagePath(packageName))) {
    spinner.error({ text: `Error: 'packages/${packageName}' already exists` })
    process.exit(1)
  }

  spinner.success({ text: 'Verified that the package does not already exist.' })

  spinner.start({ text: 'Creating new package directory...' })

  // Create new package directory packages/{packageName}
  fs.mkdirSync(packagePath(packageName), { recursive: true })

  spinner.success({ text: `Created packages/${pc.cyan(packageName)} directory.` })

  spinner.start({ text: 'Creating package files...' })

  // Create new files in packages/{packageName}
  // eslint-disable-next-line array-callback-return
  for (const filename of packageFilesToCreate) {
    const stats = fs.statSync(filename)
    const filenamePath = filename.split('__template__/')
    const relativePath = filenamePath[1]
    const newFilePath = `${packagePath(packageName)}/${relativePath.replace(/Template/g, componentName)}`

    // If template files exist
    if (stats.isFile()) {
      // Check if directory exists; if not, create it
      if (!fs.existsSync(path.dirname(newFilePath))) {
        await fs.mkdirSync(`${path.dirname(newFilePath)}`, { recursive: true })
      }

      // Replace template strings
      const fileContent = fs.readFileSync(filename, 'utf8')
        .replace(/{%%PACKAGE_NAME%%}/g, packageName)
        .replace(/{%%COMPONENT_NAME%%}/g, componentName)

      // TODO: Replace Vue peerDependency version in the __template__/package.json file

      fs.writeFileSync(newFilePath, fileContent, 'utf8')
    }
  }

  spinner.success({ text: 'Created the package files.' })

  spinner.start({ text: 'Verifying file structure...' })

  await sleep()

  const fileStructure = pc.cyan(`
    ${pc.white('packages/')}
    ${pc.white('└──')} ${packageName}/
        ├── sandbox/
        ├── src/
        │   ├── components/
        │   ├── locales/
        ├── package.json
        ├── README.md
        ├── tsconfig.build.json
        ├── tsconfig.json
        └── vite.config.ts
    `,
  )

  spinner.success({ text: 'Verified the package structure.' })

  spinner.success({
    text: `Created the new '${pc.cyan(packageName)}' package and its related files:
    ${fileStructure}`,
  })

  console.log(boxen(
    `
${pc.cyan(pc.bold(`Start Coding ${emoji.get('rocket')}`))}

Check out your package files in /packages/${packageName}/*

Your package also comes pre-configured with a Vue
sandbox where you can interact with your component(s).

Configure the component imports and usage inside the
/packages/${packageName}/sandbox/ directory.

# Run commands for your package from the root
$ ${pc.cyan(`pnpm --filter "@kong-ui/${packageName}" {your command}`)}

# Start the sandbox dev server
$ ${pc.cyan(`pnpm --filter "@kong-ui/${packageName}" run dev`)}
`,
    {
      title: `@kong-ui/${packageName}`,
      titleAlignment: 'center',
      textAlignment: 'left',
      padding: 1,
      margin: 1,
    },
  ))
}

export const createPackage = async (): Promise<void> => {
  console.clear()
  console.log(boxen(pc.cyan(pc.bold(`${emoji.get('sparkles')} Create a new component package ${emoji.get('sparkles')}`)), {
    title: '@kong-ui',
    titleAlignment: 'center',
    textAlignment: 'center',
    padding: 1,
    margin: 1,
  }))

  const getPackageName = async (): Promise<Answers> => {
    // Ask for the package name
    const { name } = await inquirer.prompt([packageName])

    // Output a message confirming their package name
    console.log('  Package name: ' + pc.cyan(`@kong-ui/${name}`))

    // Ask the user to confirm the package name
    const { confirmName } = await inquirer.prompt([confirmPackageName])

    if (!confirmName) {
      // The user did NOT confirm the package name, so inform them that we're starting over
      console.log('  Ok, let\'s start over...')
      console.log('')

      // Start over
      return getPackageName()
    }

    return {
      name,
    }
  }

  const answers = await getPackageName()

  // Create packages/* files
  await createPackageFiles(answers.name)
}
