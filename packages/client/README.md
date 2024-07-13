# @oncord/client

OnCord is a simple discord.js framework to simplify your coding.


## Project Structure
```
my-bot/
├── index.js
├── commands/
│   └── util/
│       └── ping.js
└── package.json
```

## Code sample
`mybot/index.js`
```js
const { Gateway } = require('@oncord/client')

const client = new Gateway("BOT_TOKEN", {
    intents: ['Guilds']
});

client.handleCommands(__dirname+"/commands", ".js"); // <Gateway>.handleCommands(folderPath, fileExtension);

client.login();
```

# Contribute
You can contribute with this project on GitHub!
Also, you can ask anything about it there.
- [Link](https://github.com/igorwastaken/oncord)

Thanks!