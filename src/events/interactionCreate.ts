import {Interaction} from "discord.js";
import commands from "../registries/commandRegistry";
import enabledChannels from "../persistence/enabledChannels";

export default async (interaction: Interaction) => {
    console.log("Received interaction.");
    if (!interaction.isCommand()) return;

    if (enabledChannels.has(interaction.channelId)) {
        console.log("Channel is enabled!")
    } else {
        console.log("Channel is not enabled!")
    }

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}