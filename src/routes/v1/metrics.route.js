const express = require('express');
const metricsController = require('../../controllers/metrics.controller');
const { grantAccess } = require('../../middlewares/validateAccessControl');
const { resources } = require('../../config/roles');

const router = express.Router();

router.get(
    '/jobs',
    grantAccess('readAny', resources.JOB),
    metricsController.getJobCount
);

router.get(
    '/users',
    grantAccess('readAny', resources.USERINFO),
    metricsController.getUserCount
);

router.get(
    '/applications',
    grantAccess('readAny', resources.APPLICATION),
    metricsController.getApplicationCount
);

module.exports = router;