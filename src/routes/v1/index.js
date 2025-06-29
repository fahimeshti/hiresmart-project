const express = require('express');
const authRoute = require('./auth.route');
const docsRoute = require('./docs.route');
const jobListingRoute = require('./jobListing.route');
const employerRoute = require('./employer.route');
const metricsRoute = require('./metrics.route');
const healthRoutes = require('./health.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/jobs', jobListingRoute);
router.use('/employer', employerRoute);
router.use('/docs', docsRoute);
router.use('/metrics', metricsRoute);
router.use('/health', healthRoutes);

module.exports = router;
