const express = require('express');
const validate = require("../../middlewares/validate");
const jobController = require('../../controllers/jobListing.controller');
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


/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job listing and application management
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get recent job listings
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for job title or description
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location filter
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'

 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobInput'
 *     responses:
 *       201:
 *         description: Job created
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /jobs/{jobId}:
 *   patch:
 *     summary: Update a job listing
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobUpdate'
 *     responses:
 *       200:
 *         description: Job updated
 *       403:
 *         description: Forbidden

 *   delete:
 *     summary: Delete a job listing
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       204:
 *         description: Job deleted
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /jobs/{jobId}/apply:
 *   post:
 *     summary: Apply to a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationInput'
 *     responses:
 *       201:
 *         description: Application submitted
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /jobs/{jobId}/applications:
 *   get:
 *     summary: Get all applications for a job (employer only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of applications
 */

/**
 * @swagger
 * /jobs/{jobId}/stats:
 *   get:
 *     summary: Get application stats for a job (employer only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application statistics
 */
