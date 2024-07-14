import { ChatInputApplicationCommandData, CommandInteraction } from "discord.js";

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
