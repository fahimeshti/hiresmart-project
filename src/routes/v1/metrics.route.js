
const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { grantAccess } = require('../../middlewares/validateAccessControl');
const { resources } = require('../../config/roles');

const router = express.Router();

router
    .route('/jobs')
    .get(
        grantAccess('readAny', resources.JOB),
        validate(userValidation.getJobCount),
        userController.getJobCount
    );

router.route('/users')
    .get(
        grantAccess('readAny', resources.USERINFO),
        validate(userValidation.getUserCount),
        userController.getUserCount
    );

router.route('/applications')
    .get(
        grantAccess('readAny', resources.APPLICATION),
        validate(userValidation.getApplicationCount),
        userController.getApplicationCount
    );

module.exports = router;