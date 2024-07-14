import { Client, ClientOptions, Collection, CommandInteraction, Interaction, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import { APIApplicationCommand } from 'discord-api-types/v10'

export interface CommandData extends APIApplicationCommand {
    name: string;
    description: string;
}

export type CommandType = {
    data: CommandData;
    execute: (interaction: CommandInteraction) => void;
}

export class Gateway extends Client {
    public token: string;
    public commands = new Collection<string, CommandType>();
    public commandData: APIApplicationCommand[] = [];
    constructor(token: string, options: ClientOptions) {
        super(options)

        this.token = token;
    }

    async login(): Promise<string> {
        if (!this.token) throw new Error("Please provide a Discord bot token.");
        return super.login(this.token);
    }

    handleCommands(folderName: string, fileExtension: string = ".ts") {
        const client = this;
        const foldersPath = path.join(folderName);
        const commandFolders = readdirSync(foldersPath);
        (async () => {
            for (const folder of commandFolders) {
                const commandsPath = path.join(foldersPath, folder);
                const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(fileExtension));
                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    const commandModule = await import(filePath);
                    const command = commandModule.default as CommandType;
                    // Set a new item in the Collection with the key as the command name and the value as the exported module
                    if ('data' in command && 'execute' in command) {
                        client.commands.set(command.data.name, command);
                    } else {
                        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                    }
                }
            }
        })()
        this.on("ready", () => this._registerCommands());
        this.on("interactionCreate", async (interaction: Interaction) => {
            if (!interaction.isChatInputCommand()) return;

            const command = this.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        })
    }
    
    private _registerCommands() {
        const rest = new REST().setToken(this.token);

        this.commands.map((cmd: CommandType) => {
            this.commandData.push(cmd.data);
        });
        // and deploy your commands!
        (async () => {
            try {
                console.log(`Started refreshing ${this.commands.size} application (/) commands.`);

                // The put method is used to fully refresh all commands in the guild with the current set
                const data: any = await rest.put(
                    Routes.applicationCommands(this.application?.id as string),
                    { body: this.commandData },
                );

                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        })();
    }
}