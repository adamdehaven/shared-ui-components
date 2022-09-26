#!/usr/bin/env node
import pc from 'picocolors'
import boxen from 'boxen'
import inquirer, { Answers } from 'inquirer'
import emoji from 'node-emoji'
import { createPackageFiles } from './core'
import questions from './questions'

const { packageName, confirmPackageName } = questions

const createKongponent = async (): Promise<void> => {
  console.log('')
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

createKongponent()
