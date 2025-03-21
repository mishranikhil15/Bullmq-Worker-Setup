const { Queue: BullQueue } = require("bullmq");
const redisConnection = require("./config.js");
const TaskWorker = require("./Worker.js");
let instance = {};
let workers = {};
class Queue {
  constructor(queueName = "TaskQueue", queueConfigs) {
    if (!instance[queueName]) {
      console.log("creating instance------", queueName);
      instance[queueName] = new BullQueue(
        queueName,
        queueConfigs || {
          connection: redisConnection,
          defaultJobOptions: {
            attempts: 0,
            backoff: {
              type: "exponential",
              delay: 5000,
            },
            removeOnComplete: true,
            removeOnFail: false,
          },
        }
      );
    }
    if (!workers[queueName]) {
      TaskWorker(queueName);
    }
    return instance[queueName];
  }
}
module.exports = Queue;
