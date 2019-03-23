const TelegramBot = require("node-telegram-bot-api");
const AWS = require("aws-sdk");

const { TELEGRAM_TOKEN, SQS_URL, AWS_REGION } = process.env;
AWS.config.update({ region: AWS_REGION });
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const bot = new TelegramBot(TELEGRAM_TOKEN, {
  polling: true
});

const addMessageToSQS = async msg => {
  const {
    from: { first_name, last_name },
    text
  } = msg;
  console.log(`${first_name} ${last_name} >> ${text}`);

  const jobParams = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: SQS_URL
  };

  sqs.sendMessage(jobParams, (err, data) => {
    if (err) return console.log(err);

    bot.sendMessage(msg.chat.id, "Ok");
  });
};

bot.on("message", addMessageToSQS);
