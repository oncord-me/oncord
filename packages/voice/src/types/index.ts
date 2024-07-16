import { AudioResource, CreateAudioResourceOptions } from "@discordjs/voice";
import { Guild, VoiceChannel } from "discord.js"

export type VoiceOptions = {
    channel: VoiceChannel;
    guild: Guild;
}
export interface JoinVoiceOptions {
    resources: CreateAudioResourceOptions<MediaMetadata>
}