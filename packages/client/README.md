# @oncordjs/client

OnCord is a simple and intuitive framework built on top of discord.js, designed to simplify your Discord bot development.

## Features
- **Ease of Use**: Simplifies common tasks in discord.js.
- **Command Handling**: Automatically loads and registers commands from a specified directory.
- **TypeScript Support**: Fully compatible with TypeScript for better development experience.

## Installation

Install the package via npm:

```sh
npm install @oncordjs/client
```

## Using the CLI (for TypeScript)

We've simplified bot creation with a single command. Follow these steps to install:

1. Install the CLI globally:
    ```bash
    npm install -g @oncordjs/generate
    ```

2. Create a new project:
    ```bash
    create-oncord-project my-project-name
    ```

This will generate a new directory called `my-project-name` with the necessary files and structure for your Oncord bot.

3. Navigate to your project directory:
    ```bash
    cd my-project-name
    ```

Your project is now set up and ready for development. Follow the steps in the documentation to start building your Discord bot with `@oncordjs/client`.


## Project Structure

The recommended project structure is as follows:

```
my-bot/
├── src/
│   ├── index.ts
│   ├── commands/
│   │   └── util/
│   │       └── ping.ts
├── tsconfig.json
└── package.json
```

## Code Sample

### JavaScript Example
`my-bot/src/index.js`

```javascript
const { Gateway } = require('@oncordjs/client')

const client = new Gateway({
    token: "YOUR_BOT_TOKEN",
    intents: ['Guilds']
});

client.handleCommands(__dirname+"/commands", ".js")

client.login()
```

### Command Example
```javascript
module.exports = {
    data: {
        name: "ping",
        description: 'Replies with Pong!'
    },
    execute: async (interaction) => {
        interaction.reply("Pong!")
    }
}
```

### TypeScript Example

`my-bot/src/index.ts`

```typescript
import { Gateway } from '@oncordjs/client';

const client = new Gateway({
    token: "YOUR_BOT_TOKEN",
    intents: ['Guilds']
});

client.handleCommands(__dirname + "/commands", ".ts"); // <Gateway>.handleCommands(folderPath, fileExtension);

client.login();
```

### Command Example

`my-bot/src/commands/util/ping.ts`

```typescript
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
```

## Contributing

Contributions are welcome! If you have any questions or want to contribute, you can find the project on GitHub. Feel free to open issues or submit pull requests.

- [GitHub Repository](https://github.com/igorwastaken/oncord)

Thank you for using OnCord! We still have a lot more to add, so stay tuned for the upcoming updates!

## Additional Notes
- **Installation Instructions**: Added installation instructions for npm.
- **TypeScript Example**: Updated the code samples to use TypeScript for better type safety.
- **Command Example**: Provided a complete example of a command file.
- **Contributing Section**: Improved the contribution section for clarity.
