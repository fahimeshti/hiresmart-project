const Joi = require('@hapi/joi');

// Allowed status values
const validStatuses = ['pending', 'accepted', 'rejected'];

// Create Application
const createApplication = {
    body: Joi.object().keys({
        job_id: Joi.number().integer().required(),
        cover_letter: Joi.string().allow(null, ''), // optional
    }),
};

// Update Application Status (e.g., by employer or admin)
const updateApplication = {
    params: Joi.object().keys({
        applicationId: Joi.number().required(),
    }),
    body: Joi.object()
        .keys({
            status: Joi.string().valid(...validStatuses),
            cover_letter: Joi.string().allow(null, ''),
        })
        .min(1),
};

// Get Application by ID
const getApplication = {
    params: Joi.object().keys({
        applicationId: Joi.number().required(),
    }),
};

// Delete Application
const deleteApplication = {
    params: Joi.object().keys({
        applicationId: Joi.number().required(),
    }),
};

// Optional: Search/Filter Applications
const getApplications = {
    query: Joi.object().keys({
        job_id: Joi.number().integer(),
        candidate_id: Joi.number().integer(),
        status: Joi.string().valid(...validStatuses),
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
    }),
};

module.exports = {
    createApplication,
    updateApplication,
    getApplication,
    deleteApplication,
    getApplications,
};
