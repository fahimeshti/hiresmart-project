const Joi = require('@hapi/joi');

// Create Job Listing
const createJob = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().optional().allow(null, ''),
        salary: Joi.number().optional().positive().allow(null),
        required_skills: Joi.array()
            .items(Joi.string().trim())
            .optional()
            .allow(null),
    }),
};

// Update Job Listing
const updateJob = {
    params: Joi.object().keys({
        jobId: Joi.required(),
    }),
    body: Joi.object()
        .keys({
            title: Joi.string(),
            description: Joi.string(),
            location: Joi.string().allow(null, ''),
            salary: Joi.number().positive().allow(null),
            required_skills: Joi.array().allow(null),
        })
        .min(1),
};

// Get One Job Listing
const getJob = {
    params: Joi.object().keys({
        jobId: Joi.string().required(),
    }),
};

// Get Jobs (e.g. for listing employer jobs)
const getJobs = {
    query: Joi.object().keys({
        title: Joi.string(),
        location: Joi.string(),
        limit: Joi.number().min(1),
        page: Joi.number().min(1),
    }),
};

// Delete Job Listing
const deleteJob = {
    params: Joi.object().keys({
        jobId: Joi.string().required(),
    }),
};

module.exports = {
    createJob,
    updateJob,
    getJob,
    getJobs,
    deleteJob,
};
