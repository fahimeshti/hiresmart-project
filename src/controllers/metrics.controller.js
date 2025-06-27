const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { metricsService } = require('../services');

const getJobCount = catchAsync(async (req, res) => {
    const count = await metricsService.getJobCount();
    res.status(httpStatus.OK).send({ jobCount: count });
});

const getUserCount = catchAsync(async (req, res) => {
    const count = await metricsService.getUserCount();
    res.status(httpStatus.OK).send({ userCount: count });
});

const getApplicationCount = catchAsync(async (req, res) => {
    const count = await metricsService.getApplicationCount();
    res.status(httpStatus.OK).send({ applicationCount: count });
});

module.exports = {
    getJobCount,
    getUserCount,
    getApplicationCount
};