import { Client, Collection, VoiceChannel } from "discord.js";
import { JoinVoiceOptions, VoiceOptions } from "./types";
import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, entersState, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior, StreamType, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { Gateway } from '@oncordjs/client';
import playdl from 'play-dl';
import { Readable } from "stream";

export interface Queue {
    songs: string[];
    connection: VoiceConnection | undefined;
    player: AudioPlayer | undefined;
}

interface AudioPlayerMetadata {
    channel: VoiceChannel;
    track: string;
}

export class Voice {
    public connection: VoiceConnection | undefined;
    public volume: number = 100;
    public player: AudioPlayer;

    public constructor() {
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            },
        });

        this.player.on("stateChange", async (oldState, newState) => {
            if (
                oldState.status !== AudioPlayerStatus.Idle &&
                newState.status === AudioPlayerStatus.Idle
            ) {
                const channel = (
                    oldState.resource as AudioResource<AudioPlayerMetadata>
                ).metadata.channel;
                const client = channel.client as Gateway;
                const guildQueue = client?.queue.get(channel.guildId) as Queue;
                if (guildQueue.songs.length === 0) return;

                const stream = await playdl.stream(guildQueue.songs[0], {

                });

                guildQueue.songs.shift();
                await this.playUrl(stream.stream, channel, {
                    resources: {
                        inputType: stream.type,
                    },
                });
            }
        });
    }

    public async connect(client: Client, options: VoiceOptions) {
        const connection = joinVoiceChannel({
            channelId: options.channel.id,
            guildId: options.guild.id,
            adapterCreator: options.guild.voiceAdapterCreator,
        });

        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
            this.connection = connection;
            return connection;
        } catch (error) {
            connection.destroy();
            throw new Error('Failed to connect to the voice channel.');
        }
    }
    /**
     * Ok, I'm still fixing this.
     */
    private async play(song: string, channel: VoiceChannel) {
        if (!song) return;
        const client = channel.client as Gateway;
        const queue = client.queue as Collection<string, Queue>;
        if (!queue) throw new Error("Can't find the Queue Collection.");
        const guildQueue = queue.get(channel.guildId);
        const stream = await playdl.stream(song);
        if (!guildQueue) {
            if (!stream) throw new Error("Can't check song stream.");

            await this.playUrl(stream.stream, channel, {
                resources: {
                    inputType: stream.type
                },
            });
            const queueConstruct: Queue = {
                songs: [],
                connection: this.connection,
                player: this.player,
            };
            queueConstruct.songs.push(song);

            queue.set(channel.guildId, queueConstruct);
        } else {
            guildQueue.songs.push(song);
        }

        return {
            queue,
            connection: this.connection,
            player: this.player,
        };
    }

    public async playUrl(url: Readable | string, channel: VoiceChannel, options?: JoinVoiceOptions) {
        if (!this.connection) {
            this.connection = await this.connect(channel.client, {
                channel: channel,
                guild: channel.guild,
            });
        }

        if (!this.connection) return;

        const connection = this.connection;
        var subscriber: any;// = connection.subscribe(this.player);

        connection
            .on(VoiceConnectionStatus.Disconnected, async () => {
                try {
                    await Promise.race([
                        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                } catch (error) {
                    connection.destroy();
                }
            })
            .on(VoiceConnectionStatus.Destroyed, () => {
                this.player?.stop();
                subscriber?.unsubscribe();
            });

        const resource = createAudioResource(url, {
            inlineVolume: true,
            ...options?.resources,
            metadata: {
                channel: channel,
            },
        });

        const networkStateChangeListener = (
            oldNetworkState: object,
            newNetworkState: object,
        ) => {
            const newUdp = Reflect.get(newNetworkState, "udp");
            clearInterval(newUdp?.keepAliveInterval);
        };

        connection.on("stateChange", (oldState, newState) => {
            const oldNetworking = Reflect.get(oldState, "networking");
            const newNetworking = Reflect.get(newState, "networking");

            oldNetworking?.off("stateChange", networkStateChangeListener);
            newNetworking?.on("stateChange", networkStateChangeListener);
        });

        resource.volume?.setVolumeLogarithmic(this.volume / 100);
        this.player.play(resource);
        subscriber = await connection.subscribe(this.player);
        return {
            connection,
            resource,
            subscriber,
            player: this.player,
        };
    }

    public setVolume(volume: number) {
        this.volume = volume;
        if (this.player?.state.status === AudioPlayerStatus.Playing) {
            this.player?.state.resource.volume?.setVolume(this.volume / 100);
        }
    }
}
