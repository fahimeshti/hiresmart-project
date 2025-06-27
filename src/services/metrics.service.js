const db = require('../db/models');

async function getJobCount() {
    const count = await db.job_listing.count();
    return count;
}

async function getUserCount() {
    const count = await db.user.count();
    return count;
}

async function getApplicationCount() {
    const count = await db.application.count();
    return count;
}

module.exports = {
    getJobCount,
    getUserCount,
    getApplicationCount,
};
