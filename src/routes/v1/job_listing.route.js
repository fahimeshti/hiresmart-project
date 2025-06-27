const express = require('express');
const validate = require("../../middlewares/validate");
const jobController = require('../../controllers/job_listing.controller');
const applicationController = require('../../controllers/application.controller');
const { jobValidation } = require('../../validations');
const { grantAccess } = require('../../middlewares/validateAccessControl');
const { resources } = require('../../config/roles');

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

router
    .route('/:jobId/apply')
    .post(
        grantAccess('createOwn', resources.APPLICATION),
        applicationController.createApplication
    );

router
    .route('/:jobId/applications')
    .get(
        grantAccess('readOwn', resources.APPLICATION),
        applicationController.getApplicationsForJob
    );

module.exports = router;
