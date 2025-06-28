
const httpStatus = require('http-status');
const { jobListingService } = require('../services');
const catchAsync = require('../utils/catchAsync');


const createJob = catchAsync(async (req, res) => {
    const job = await jobListingService.createJob(req);
    res.status(httpStatus.CREATED).send({ job });
});

const getAllJobs = catchAsync(async (req, res) => {
    const { keyword, location } = req.query;
    const jobs = await jobListingService.getAllJobs({ keyword, location });
    res.status(httpStatus.OK).send({ jobs });
});

const getJobsByEmployer = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const jobs = await jobListingService.getJobsByEmployer(userId);
    res.status(httpStatus.OK).send({ jobs });
});

const updateJob = catchAsync(async (req, res) => {
    const job = await jobListingService.updateJob(req);
    res.status(httpStatus.OK).send({ job });
});

const deleteJob = catchAsync(async (req, res) => {
    await jobListingService.deleteJob(req);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createJob,
    getJobsByEmployer,
    updateJob,
    getAllJobs,
    deleteJob,
};