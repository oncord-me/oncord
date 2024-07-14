import { Gateway } from '@oncordjs/client';
import { GatewayIntentBits } from 'discord.js';
import { describe, it } from 'node:test';

describe('Gateway Client', () => {
  it('should create a new client with the correct token and intents', () => {
    const token = "YOUR_BOT_TOKEN";
    const options = { intents: [GatewayIntentBits.Guilds] };
    const client = new Gateway(token, options);

    expect((client as any).token).toBe(token);
    expect((client as any).options).toEqual(options);
  });

  it('should handle commands from the specified directory', () => {
    const client = new Gateway("YOUR_BOT_TOKEN", { intents: ['Guilds'] });
    const handleCommandsSpy = jest.spyOn(client, 'handleCommands');
    client.handleCommands(__dirname + "/commands", ".js");

    expect(handleCommandsSpy).toHaveBeenCalledWith(__dirname + "/commands", ".js");
  });

  it('should login the client', () => {
    const client = new Gateway("YOUR_BOT_TOKEN", { intents: ['Guilds'] });
    const loginSpy = jest.spyOn(client, 'login');
    client.login();

    expect(loginSpy).toHaveBeenCalled();
  });
});
