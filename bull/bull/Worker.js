const { Worker } = require("bullmq");
const redisConnection = require("./config.js");
const path = require("path");
const TaskWorker = (workerName = "TaskQueue") => {
  const TaskWorkerInstance = new Worker(
    workerName,
    async (job) => {
      try {
        const task = require(`${path.dirname(__filename)}/jobs/${job.name}.js`);
        new task().handle(job);
      } catch (error) {
        throw error;
      }
      console.log(`Processing job ID ${job.id} with data:`, job.data);
      return { success: true, processedAt: new Date() };
    },
    {
      connection: redisConnection,
      concurrency: 1,
      autorun: true,
      // removeOnComplete: true,
      // removeOnFail: true,
    }
  );

  TaskWorkerInstance.on("completed", (job) => {
    console.log(`Job ${job.id} completed successfully.`);
  });

  TaskWorkerInstance.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });
};

module.exports = TaskWorker;
