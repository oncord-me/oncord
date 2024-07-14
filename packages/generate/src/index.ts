#!/usr/bin/env node

import { Command } from 'commander';
import { generateProject } from './generate';

const program = new Command();

program
  .name('create-oncord-project')
  .description('CLI to generate a new project using @oncordjs/client')
  .version('1.0.0')
  .argument('<project-name>', 'name of the project')
  .action((projectName: string) => {
    generateProject(projectName);
  });

program.parse(process.argv);