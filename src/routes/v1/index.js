const express = require('express');
const authRoute = require('./auth.route');
const roleRoute = require('./role.route');
const docsRoute = require('./docs.route');
const jobListingRoute = require('./jobListing.route');
const employerRoute = require('./employer.route');
const metricsRoute = require('./metrics.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/roles', roleRoute);
router.use('/jobs', jobListingRoute);
router.use('/employer', employerRoute);
router.use('/docs', docsRoute);
router.use('/metrics', metricsRoute);

module.exports = router;
