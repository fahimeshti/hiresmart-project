const httpStatus = require('http-status');
const db = require('../db/models');
const ApiError = require('../utils/ApiError');
const { fn, col } = require('sequelize');

async function createApplication(req) {
    const { cover_letter } = req.body;
    const { jobId: job_id } = req.params;
    const candidateId = req.user.userId;

    // Check if the job exists
    const job = await db.job_listing.findByPk(job_id);
    if (!job) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
    }

    // Check if the candidate has already applied for this job
    const existingApplication = await db.application.findOne({
        where: { job_id, candidate_id: candidateId },
    });
    if (existingApplication) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You have already applied for this job');
    }

    const application = await db.application.create({
        job_id,
        candidate_id: candidateId,
        cover_letter,
    });

    return application.get({ plain: true });
}

async function getApplicationsForJob(jobId, employerId) {
    const job = await db.job_listing.findByPk(jobId);

    if (!job) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
    }
    // Check if the employer is authorized to view applications for this job
    if (job.employer_id !== employerId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view applications for this job');
    }

    const applications = await db.application.findAll({
        where: { job_id: jobId },
        include: [
            {
                model: db.user,
                as: 'candidate',
                attributes: ['id', 'name', 'email'],
            },
        ],
        attributes: { exclude: ['candidate_id'] },
    });

    if (!applications || applications.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No applications found for this job');
    }

    return applications.map((app) => app.get({ plain: true }));
}

async function getJobApplicationStats(jobId) {
    const CACHE_KEY = `job_stats:${jobId}`;

    try {
        const cached = await redisClient.get(CACHE_KEY);
        if (cached) {
            console.log(`[Redis] Cache hit for ${CACHE_KEY}`);
            return JSON.parse(cached);
        }
    } catch (err) {
        console.warn(`Redis cache read error:`, err);
    }

    const job = await db.job_listing.findByPk(jobId);
    if (!job) {
        throw new Error('Job not found');
    }

    const statusCounts = await db.application.findAll({
        attributes: [
            'status',
            [fn('COUNT', col('status')), 'count']
        ],
        where: { job_id: jobId },
        group: ['status'],
        raw: true,
    });

    const stats = {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
    };

    for (const row of statusCounts) {
        const { status, count } = row;
        const safeCount = parseInt(count, 10) || 0;
        stats.total += safeCount;

        if (stats.hasOwnProperty(status)) {
            stats[status] = safeCount;
        }
    }

    // Cache the result in Redis for 5 minutes
    try {
        await redisClient.setEx(CACHE_KEY, 300, JSON.stringify(stats));
        console.log(`[Redis] Cached ${CACHE_KEY} for 5 minutes`);
    } catch (err) {
        console.warn(`Redis cache write error:`, err);
    }

    return stats;
}


module.exports = {
    createApplication,
    getApplicationsForJob,
    getJobApplicationStats
};