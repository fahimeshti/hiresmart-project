const cron = require('node-cron');
const db = require('../db/models');

// Archive jobs older than 30 days; Runs every day at 2 AM
cron.schedule('0 2 * * *', async () => {
    console.log(`Archiving old job posts...`);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const [updatedCount] = await db.job_listing.update(
        { status: 'archived' },
        {
            where: {
                created_date_time: { [db.Sequelize.Op.lt]: cutoff },
                status: { [db.Sequelize.Op.ne]: 'archived' }, // Optional: Only unarchived jobs
            },
        }
    );

    console.log(`Archived ${updatedCount} job(s) older than 30 days`);
});

// Remove unverified users weekly; Runs every Sunday at 3 AM
cron.schedule('0 3 * * 0', async () => {
    console.log(`Cleaning up unverified users...`);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14); // users unverified for 2 weeks

    const deletedCount = await db.user.destroy({
        where: {
            is_verified: false,
            created_date_time: { [db.Sequelize.Op.lt]: cutoff },
        },
    });

    console.log(`Removed ${deletedCount} unverified user(s)`);
});
