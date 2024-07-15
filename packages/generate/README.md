# Create Oncord App

A CLI tool to generate new projects using `@oncordjs/client`, inspired by `create-next-app`.

## Installation

You can install the CLI globally using npm:

```bash
npm install -g @oncordjs/generate
```

## Usage

To create a new Oncord project, run:

```bash
create-oncord-app <project-name>
```

Replace `<project-name>` with the name of your new project. This will create a directory with the specified name, containing a basic project structure using `@oncordjs/client`.

### Example

```bash
create-oncord-app my-new-oncord-project
```

This will generate the following structure:

```
my-new-oncord-project/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   └── commands/
│       └── util/
│           └── ping.ts
└── ...
```

### Options

You can pass additional options to customize your project:

```bash
create-oncord-app <project-name> [options]
```

For example, you can specify a template:

```bash
create-oncord-app my-new-oncord-project --template typescript
```

## Project Structure

The recommended project structure for Oncord is as follows:

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

## Example Usage

### JavaScript Example

`my-bot/src/index.js`

```javascript
const { Gateway } = require('@oncordjs/client')

const client = new Gateway("YOUR_BOT_TOKEN", {
    intents: ['Guilds']
});

client.handleCommands(__dirname + "/commands", ".js");

client.login();
```

### Command Example

```javascript
module.exports = {
    data: {
        name: "ping",
        description: 'Replies with Pong!'
    },
    execute: async (interaction) => {
        interaction.reply("Pong!");
    }
}
```

### TypeScript Example

`my-bot/src/index.ts`

```typescript
import { Gateway } from '@oncordjs/client';

const client = new Gateway("YOUR_BOT_TOKEN", {
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

## Development

To work on the CLI tool itself, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/oncord-me/oncord.git
    ```
2. Navigate to the project directory:
    ```bash
    cd oncord
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Build the project:
    ```bash
    npm run build
    ```
5. Link the package locally for testing:
    ```bash
    npm link
    ```

You can now use `create-oncord-app` locally.

## Contributing

Contributions are welcome! If you have any questions or want to contribute, you can find the project on GitHub. Feel free to open issues or submit pull requests.

- [GitHub Repository](https://github.com/igorwastaken/oncord)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

Thank you for using OnCord!