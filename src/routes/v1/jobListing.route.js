const express = require('express');
const validate = require("../../middlewares/validate");
const jobController = require('../../controllers/job_listing.controller');
const applicationController = require('../../controllers/application.controller');
const { jobValidation } = require('../../validations');
const { grantAccess } = require('../../middlewares/validateAccessControl');
const { resources } = require('../../config/roles');
const { rateLimiter } = require('../../middlewares/rateLimiter');

const router = express.Router();

router
    .route('/')
    .get(jobController.getAllJobs)
    .post(
        grantAccess('createOwn', resources.JOB),
        validate(jobValidation.createJob),
        jobController.createJob
    );

router
    .route("/:jobId")
    .patch(
        grantAccess('updateOwn', resources.JOB),
        validate(jobValidation.updateJob),
        jobController.updateJob
    ).delete(
        grantAccess('deleteOwn', resources.JOB),
        jobController.deleteJob
    );

router.post(
    '/:jobId/apply',
    rateLimiter,
    grantAccess('createOwn', resources.APPLICATION),
    applicationController.createApplication
);

router.get(
    '/:jobId/applications',
    grantAccess('readOwn', resources.APPLICATION),
    applicationController.getApplicationsForJob
);

router.get(
    '/:jobId/stats',
    grantAccess('readOwn', resources.APPLICATION),
    applicationController.getJobApplicationStats
);

module.exports = router;
