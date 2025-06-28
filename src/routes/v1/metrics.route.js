const express = require('express');
const metricsController = require('../../controllers/metrics.controller');
const { grantAccess } = require('../../middlewares/validateAccessControl');
const { resources } = require('../../config/roles');

const router = express.Router();

router
    .route('/jobs')
    .get(
        grantAccess('readAny', resources.JOB),
        metricsController.getJobCount
    );

router.route('/users')
    .get(
        grantAccess('readAny', resources.USERINFO),
        metricsController.getUserCount
    );

router.route('/applications')
    .get(
        grantAccess('readAny', resources.APPLICATION),
        metricsController.getApplicationCount
    );

module.exports = router;