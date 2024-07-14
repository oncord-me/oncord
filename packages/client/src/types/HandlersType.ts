import { ChatInputApplicationCommandData, Client, CommandInteraction, Message, PartialMessage } from "discord.js";

export interface CommandData extends ChatInputApplicationCommandData {
    name: string;
    description: string;
}

export type CommandType = {
    data: CommandData;
    execute: (interaction: CommandInteraction) => void;
}

export type EventType = {
    name: string;
    once?: boolean;
    execute: Function;
}

export type MessageCommandType = {
    name: string;
    description?: string;
    execute: (message: Message<boolean> | PartialMessage, args: string[], client: Client) => void;
}