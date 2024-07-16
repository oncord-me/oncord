import { Client, Collection, Guild, VoiceChannel } from "discord.js";
import { VoiceOptions } from "./types";
import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior, StreamType, VoiceConnection } from '@discordjs/voice'
import { Gateway } from '@oncordjs/client'
import playdl from 'play-dl';
import { Readable } from "stream";

export interface Queue {
    songs: string[];
    connection: VoiceConnection | undefined;
}
interface AudioPlayerMetadata {
    channel: VoiceChannel;
    track: String;
}
export class Voice {
    public connection: VoiceConnection | undefined;
    public volume: number = 100;
    public player: AudioPlayer | undefined;
    public constructor() {
        this.player?.on("stateChange", async (oldState, newState) => {
            if (
                oldState.status !== AudioPlayerStatus.Idle &&
                newState.status === AudioPlayerStatus.Idle
            ) {
                const channel = (
                    oldState.resource as AudioResource<AudioPlayerMetadata>
                ).metadata.channel;
                const client = channel.client as Gateway;
                const guildQueue = client?.queue.get(channel.guildId) as Queue;
                if (!guildQueue.songs[0]) return;

                const stream = await playdl.stream(guildQueue?.songs[0], {
                    quality: 2
                })

                guildQueue.songs.shift();
                await this.playUrl(stream.stream, channel);
            }
        })
    }
    public async connect(client: Client, options: VoiceOptions) {
        this.connection = joinVoiceChannel({
            channelId: options.channel.id,
            guildId: options.guild.id,
            adapterCreator: options.guild.voiceAdapterCreator
        })
        return this.connection;
    }
    /**
     * This thing is bugged for now, i'm trying to fix it.
     */
    private async play(song: string, channel: VoiceChannel) {
        if (!song) return;
        const client = channel.client as Gateway;
        const queue = client.queue as Collection<string, Queue>;
        if (!queue) throw new Error("Can't find the Queue Collection.");
        const guildQueue = queue.get(channel.guildId);
        const stream = await playdl.stream(song, {
            quality: 2
        });
        if (!guildQueue) {
            if (!stream) throw new Error("Can't check song stream.");

            const queueConstruct: Queue = {
                songs: [],
                connection: this.connection
            }
            queueConstruct.songs.push(song);

            await this.playUrl(stream.stream, channel);
            queue.set(channel.guildId, queueConstruct);
            queueConstruct.songs.unshift(song)

        } else {
            guildQueue.songs.push(song);

        }

        return {
            queue,
            connection: this.connection,
            player: this.player
        }
    }
    public async playUrl(url: Readable | string, channel: VoiceChannel) {
        this.connect(channel.client, {
            channel: channel,
            guild: channel.guild
        });

        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        });
        const connection: VoiceConnection | undefined = getVoiceConnection(channel.guild.id);
        if (!connection) return;
        const subscriber = connection.subscribe(this.player);
        const resource = createAudioResource(url, {
            inlineVolume: true,
            inputType: StreamType.Raw,
            metadata: {
                voiceChannel: channel
            },
        });
        resource.volume?.setVolumeLogarithmic(this.volume / 100);
        this.player.play(resource)

        return {
            connection,
            resource,
            subscriber,
            player: this.player
        }
    }
    public setVolume(volume: number) {
        this.volume = volume;
        if (this.player?.state.status === AudioPlayerStatus.Playing) {
            this.player?.state.resource.volume?.setVolume(this.volume / 100);
        }
    }
}