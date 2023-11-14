import promptCMSClient from "../clients/promptcms";
import messageToExecutionId from "../persistence/messageExecutionMapping";
import {Message} from "discord.js";
import enabledChannels from "../persistence/enabledChannels";
import superagentClient from "../clients/superagent";
import discordClient from "../index";

export default async (message: Message) => {
    if (message.author.bot) return;
    if (await enabledChannels.is_enabled(message.guildId!, message.channelId!)) {
        if (message.content.includes("?") || message.mentions.has(discordClient.user!.id)) {
            console.log("Answering question...")
            // const resultData = await promptCMSClient.execute({question: message.content});
            // const result = await superagentClient.execute({input: message.content});
            const result = await promptCMSClient.invokeAgent(message.content);
            console.log(result);
            if (result) {
                await message.reply(`${result.data.output}`);
            } else {
                await message.reply({content: 'Sorry, there seems to be a problem. Please try again later.'});
            }
            // await messageToExecutionId.set(reply.id, resultData.data.execution_id)
        } else {
            console.log("No question mark found. Skipping question.")
        }
    }

}
