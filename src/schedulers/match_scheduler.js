const cron = require('node-cron');
const matchJobsAndCandidates = require('../services/job_matcher');

cron.schedule('*/1 * * * *', async () => { // run every 6 hours
    console.log('Running scheduled job match...');
    await matchJobsAndCandidates();
});
