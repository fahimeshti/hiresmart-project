const httpStatus = require('http-status');
const db = require('../db/models');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');
const redisClient = require('../config/redis');

async function createJob(req) {
    const { title, description, location, salary, required_skills } = req.body;
    const employerId = req.user.userId;

    const job = await db.job_listing.create({
        title,
        description,
        location,
        salary,
        required_skills,
        employer_id: employerId,
    });

    return job.get({ plain: true });
}

async function getAllJobs({ keyword, location } = {}) {
    // 1. Generate a unique cache key per filter combination
    const cacheKeyParts = ['recent_jobs'];
    if (keyword) cacheKeyParts.push(`keyword:${keyword}`);
    if (location) cacheKeyParts.push(`location:${location}`);
    const CACHE_KEY = cacheKeyParts.join('|');

    // 2. Try Redis cache
    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
        console.log(`[Redis] Cache hit for ${CACHE_KEY}`);
        return JSON.parse(cached);
    }

    console.log(`[Redis] Cache miss for ${CACHE_KEY}`);
    const whereClause = {};

    if (keyword) {
        whereClause[Op.or] = [
            { title: { [Op.iLike]: `%${keyword}%` } },
            { description: { [Op.iLike]: `%${keyword}%` } },
        ];
    }

    if (location) {
        whereClause.location = { [Op.iLike]: `%${location}%` };
    }

    const jobs = await db.job_listing.findAll({
        where: whereClause,
        order: [['created_date_time', 'DESC']],
        limit: 10,
        attributes: { exclude: ['employer_id'] },
    });

    const plainJobs = jobs.map((job) => job.get({ plain: true }));

    // 3. Set cache for 5 minutes
    await redisClient.setEx(CACHE_KEY, 300, JSON.stringify(plainJobs));
    console.log(`[Redis] Cached ${CACHE_KEY} for 5 min`);

    return plainJobs;
}



async function getJobById(jobId) {
    const job = await db.job_listing.findByPk(jobId);

    if (!job) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
    }

    return job.get({ plain: true });
}

async function getJobsByEmployer(employerId) {
    const jobs = await db.job_listing.findAll({
        where: { employer_id: employerId },
        order: [['created_date_time', 'DESC']],
        attributes: { exclude: ['employer_id'] },
    });

    return jobs.map((job) => job.get({ plain: true }));
}

async function updateJob(req) {
    const { jobId } = req.params;
    const { title, description, location, salary, status, required_skills } = req.body;
    const employerId = req.user.userId;

    const job = await db.job_listing.findByPk(jobId);

    if (!job) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
    }

    if (job.employer_id !== employerId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update this job');
    }

    await job.update({
        title: title ?? job.title,
        description: description ?? job.description,
        location: location ?? job.location,
        salary: salary ?? job.salary,
        status: status ?? job.status,
        required_skills: Array.isArray(required_skills) ? required_skills : job.required_skills,
        modified_date_time: new Date(),
    });

    return job.get({ plain: true });
}

async function deleteJob(req) {
    const { jobId } = req.params;
    const employerId = req.user.userId;

    const job = await db.job_listing.findByPk(jobId);

    if (!job) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
    }

    if (job.employer_id !== employerId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this job');
    }

    await job.destroy();
}

module.exports = {
    createJob,
    getJobById,
    getAllJobs,
    getJobsByEmployer,
    updateJob,
    deleteJob,
};
