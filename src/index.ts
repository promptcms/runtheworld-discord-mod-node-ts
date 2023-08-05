import {Client, Intents} from "discord.js";
import "dotenv/config";
import PromptCmsClient, {ScoreData} from "./promptCmsClient"
import MessageExecutionMapping from "./persistence/messageExecutionMapping";

const promptCmsClient = new PromptCmsClient();

const messageToExecutionId = new MessageExecutionMapping();

const discordClient = new Client({
  presence: {
    status: "online",
  },
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

discordClient.once("ready", () => {
  console.log(`Logged in as: ${discordClient.user?.tag}`);
});

discordClient.on('messageReactionAdd', async (reaction, user) => {
  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message:', error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }
  const executionId = messageToExecutionId.get(reaction.message.id);
  if (executionId) {
    if (reaction.emoji.name === '👍') {
      // positive
      const reactionAuthor = reaction.message.author!.id;
      await promptCmsClient.scoreExecution(executionId!, reactionAuthor, 1)
    } else if (reaction.emoji.name === '👎') {
      //negative
      const reactionAuthor = reaction.message.author!.id;
      await promptCmsClient.scoreExecution(executionId!, reactionAuthor, 0)
    }
  }
});

discordClient.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const warningThreshold = parseInt(
    process.env.PROMPT_WARNING_THRESHOLD || "",
    10
  );

  const resultData = await promptCmsClient.getMessageScore(message);
  const scoreData = JSON.parse(resultData.response) as ScoreData
  if (scoreData.score > (warningThreshold || 30)) {
    const replyContent = `Automod warn(${scoreData.score}): ${scoreData.reason}`;
    const reply = await message.reply(replyContent);
    messageToExecutionId.set(reply.id, resultData.execution_id);
  }
});

discordClient.login(process.env.DISCORD_TOKEN);
