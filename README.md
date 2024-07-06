
# LEGENDSMC-BOT

Another discord bot designed for LEGENDSMC Discord Server

[Main files provided by discord.js Guide](https://discordjs.guide/creating-your-bot/)

## Requirements

Discord.JS v14.15.2

Node.JS v20.12.2

## Files to run 

PATH `./configs/main.json`

```
{
    "token": "",
    "clientId": "",
    "guildId": "",
    "logsChannelId": "",
    "autoBanChannelId": "",
    "ticketMessageChannelId": "",
    "ticketCategoryId": "",
    "adminRoleId": "",
    "ticketLogsChannelId": "",
    "rulesChannelId": ""
}
```

## Command deploy & delete

[Source](https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration)


To deploy global commands, run:

```node deploy-commands.js```

To delete global commands. run:

```node delete-commands.js```