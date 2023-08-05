import { SlashCommandBuilder } from '@discordjs/builders';
import {BaseCommandInteraction} from "discord.js";
import enabledChannels from "../persistence/enabledChannels";

export const data = new SlashCommandBuilder()
    .setName('enable')
    .setDescription('Enables bot for this channel.');

export async function execute(interaction: BaseCommandInteraction) {
    console.log(`Enabling for channel ${interaction.channelId}.`)
    enabledChannels.add(interaction.channelId);
    await interaction.reply('Enabled!');
}
