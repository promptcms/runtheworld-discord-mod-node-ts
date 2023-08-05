import { SlashCommandBuilder } from '@discordjs/builders';
import {BaseCommandInteraction} from "discord.js";
import enabledChannels from "../persistence/enabledChannels";

export const data = new SlashCommandBuilder()
    .setName('disable')
    .setDescription('Disables bot for this channel.');

export async function execute(interaction: BaseCommandInteraction) {
    console.log(`Disabling for channel ${interaction.channelId}.`)
    enabledChannels.delete(interaction.channelId);
    await interaction.reply('Disabled!');
}
