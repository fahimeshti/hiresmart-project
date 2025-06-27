
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { applicationService } = require('../services');

const createApplication = catchAsync(async (req, res) => {
    const application = await applicationService.createApplication(req);
    res.status(httpStatus.CREATED).send({ application });
});

const getApplicationsForJob = catchAsync(async (req, res) => {
    const { jobId } = req.params;
    const employerId = req.user.userId;
    const applications = await applicationService.getApplicationsForJob(jobId, employerId);
    res.status(httpStatus.OK).send({ applications });
});

module.exports = {
    createApplication,
    getApplicationsForJob
};
