const httpStatus = require('http-status');
const db = require('../db/models');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

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
        attributes: { exclude: ['employer_id'] },
    });

    return jobs.map((job) => job.get({ plain: true }));
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
    const { title, description, location, salary } = req.body;
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
