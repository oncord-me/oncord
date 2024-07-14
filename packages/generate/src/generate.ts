import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export function generateProject(projectName: string) {
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`Error: Directory ${projectName} already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath, { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'src'));
  fs.mkdirSync(path.join(projectPath, 'src', 'commands'));
  fs.mkdirSync(path.join(projectPath, 'src', 'commands', 'util'));

  // Create package.json
  const packageJson = {
    name: projectName,
    version: "1.0.0",
    main: "index.ts",
    scripts: {
      'start:dev': "ts-node src/index.ts",
      'start': "node dist/index.js",
      'build': "tsc"
    },
    dependencies: {
      "@oncordjs/client": "^1.1.1",
      "discord.js": "^14.15.3"
    },
    devDependencies: {
      "typescript": "^5.5.3",
      "ts-node": "^10.9.2",
      "@types/node": "^20.14.10"
    }
  };

  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create tsconfig.json
  const tsconfig = {
    "compilerOptions": {
      "target": "ES6",
      "module": "commonjs",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "outDir": "./dist"
    },
    "include": ["src"],
    "exclude": ["node_modules"]
  };

  fs.writeFileSync(
    path.join(projectPath, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2)
  );

  // Create src/index.ts
  const indexTs = `
import { Gateway } from '@oncordjs/client';

const client = new Gateway({
    token: "YOUR_BOT_TOKEN",
    intents: ['Guilds']
});

client.handleCommands(__dirname + "/commands", ".ts"); // <Gateway>.handleCommands(folderPath, fileExtension);

client.login();
  `;

  fs.writeFileSync(path.join(projectPath, 'src', 'index.ts'), indexTs);

  // Create src/commands/util/ping.ts
  const pingTs = `
import { CommandType } from '@oncordjs/client';
import { CommandInteraction } from 'discord.js';

const command: CommandType = {
    data: {
        name: 'ping',
        description: 'Replies with Pong!'
    },
    execute: async (interaction: CommandInteraction) => {
        await interaction.reply('Pong!');
    }
};

export default command;
  `;

  fs.writeFileSync(path.join(projectPath, 'src', 'commands', 'util', 'ping.ts'), pingTs);

  // Install dependencies
  execSync('npm install', { cwd: projectPath, stdio: 'inherit' });

  console.log(`Project ${projectName} created successfully.`);
}
