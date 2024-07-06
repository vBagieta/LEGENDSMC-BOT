const { rulesChannelId } = require('../../configs/main.json');
const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder,
    EmbedBuilder,
    time,
    channelMention,
    TimestampStyles,
    PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Wyślij regulamin na kanał.')
        .addBooleanOption(option =>
            option.setName('update')
                .setDescription('Oznaczyć regulamin jako zaktualizowany?'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) { 
        const updated = interaction.options.getBoolean('update') ?? false;
        const filePath = path.resolve(__dirname, '../../configs/dates.json');
        let updatedDate;

        if (updated) {
            updatedDate = time(Math.floor(Date.now() / 1000), TimestampStyles.RelativeTime);

            fs.readFile(filePath, 'utf8', (error, data) => {
                if (error) {
                    console.error('Błąd przy odczytywaniu pliku:', error);
                    return;
                }

                let jsonData;
                try {
                    jsonData = JSON.parse(data);
                } catch (parseError) {
                    console.error('Błąd przy parsowaniu pliku JSON:', parseError);
                    return;
                }

                jsonData.rulesUpdateTimestamp = updatedDate;

                const updatedJsonData = JSON.stringify(jsonData, null, 2);
                fs.writeFile(filePath, updatedJsonData, (writeErr) => {
                    if (writeErr) {
                        console.error('Błąd przy zapisywaniu pliku:', writeError);
                    } else {
                        console.log('Dane zostały zaktualizowane i zapisane do pliku:', filePath);
                    }
                });
            });
        } else {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                const jsonData = JSON.parse(data);
                updatedDate = jsonData.rulesUpdateTimestamp;
            } catch (error) {
                console.error(error);
                return;
            }
        }

        const rulesEmbed = new EmbedBuilder()
            .setAuthor({
                name: 'REGULAMIN SERWERA LEGENDSMC.PL',
                iconURL: 'https://i.imgur.com/GNSNUOS.png'
            })
            .setColor('Red')
            .setDescription(
                '**Art. 1 Postanowienia ogólne**\n' +
                '**§1** Każdy użytkownik w chwili dołączenia na serwer automatycznie akceptuje poniższy regulamin.\n' +
                '**§2** Nie znajomość regulaminu lub jego nie zrozumienie nie zwalnia z jego nie przestrzegania.\n' +
                '**§3** Administrator może ukarać gracza za przewinienia nie uwzględnione w tym regulaminie, jeżeli uzna to za stosowne.\n' +
                '**§4** Administracja zastrzega sobie prawo do edycji regulaminu bez wcześniejszego poinformowania użytkowników.\n' +
                '**§5** Ten regulamin jest własnością serwera LEGENDSMC.PL.\n\n' +
                '**Art. 2 Serwer Discord**\n' +
                '**§1** Na kanałach tekstowych jest obowiązek przestrzegania zasad kultury osobistej.\n' +
                '**§2** Zakaz publikowania wrażliwych danych m.in: adres zamieszkania, zdjęcia.\n' +
                '**§3** Zakaz obrażania, prowokowania itp. innych użytkowników serwera.\n' +
                '**§4** Zakaz publikowania treści powszechnie uważanych za nieetyczne.\n' +
                '**§5** Zakaz podszywania się pod administrację serwera oraz jego użytkowników.\n' +
                '**§6** Zakaz reklamowania innych serwerów gry Minecraft.\n' +
                '**§7** Użytkownik jak i administracja jest zobowiązany do przestrzegania zasad Discorda.\n\n' +
                '**Art. 3 Serwer Minecraft**\n' +
                '**§1** Gracz ma obowiązek zgłaszać wszelkie błędy na serwerze.\n' +
                '**§2** Zakaz obrażania, prowokowania itp. innych graczy.\n' +
                '**§3** Zakaz używania niedozwolonych modyfikacji, cheatów czy klientów.\n' +
                '**§4** Zakaz podszywania się pod administrację serwera oraz jego graczy.\n\n' +
                '**Ostatnia aktualizacja:** ' + updatedDate
            );

        const channel = interaction.guild.channels.cache.get(rulesChannelId);
        const messages = await channel.messages.fetch({ limit: 1 });
        
        if (messages.size === 1) {
            await messages.first().delete();
        }

        await channel.send({ embeds: [rulesEmbed] });
        await interaction.reply({
            content: `Pomyślnie wysłano panel na kanał ` + channelMention(channel.id),
            ephemeral: true 
        });
    },
};
