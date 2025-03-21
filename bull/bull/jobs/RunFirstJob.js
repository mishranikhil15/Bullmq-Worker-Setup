class RunFirstJob {
  handle(job) {
    console.log("converting jpg to pdf", job.data);
  }
}

module.exports = RunFirstJob;
