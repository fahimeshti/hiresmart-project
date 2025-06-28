
const express = require('express');
const validate = require("../../middlewares/validate");
const jobController = require('../../controllers/jobListing.controller');
const { jobValidation } = require('../../validations');
const { grantAccess } = require('../../middlewares/validateAccessControl');
const { resources } = require('../../config/roles');

const router = express.Router();

router.get(
    "/jobs",
    grantAccess('readOwn', resources.JOB),
    jobController.getJobsByEmployer
);

module.exports = router;
