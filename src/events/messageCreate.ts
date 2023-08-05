import promptCMSClient, {ScoreData} from "../clients/promptcms";
import messageToExecutionId from "../persistence/messageExecutionMapping";
import {Message} from "discord.js";

export default async (message: Message) => {
    if (message.author.bot) return;

    const warningThreshold = parseInt(
        process.env.PROMPT_WARNING_THRESHOLD || "",
        10
    );

    const resultData = await promptCMSClient.getMessageScore(message);
    const scoreData = JSON.parse(resultData.response) as ScoreData
    if (scoreData.score > (warningThreshold || 30)) {
        const replyContent = `Automod warn(${scoreData.score}): ${scoreData.reason}`;
        const reply = await message.reply(replyContent);
        messageToExecutionId.set(reply.id, resultData.execution_id);
    }
}