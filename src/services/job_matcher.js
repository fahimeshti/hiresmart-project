const db = require('../db/models');

function hasSkillMatch(candidateSkills, jobSkills) {
    if (!Array.isArray(candidateSkills) || !Array.isArray(jobSkills)) return false;
    if (jobSkills.length === 0 || candidateSkills.length === 0) return false;

    return jobSkills.every(skill => candidateSkills.includes(skill));
}

async function matchJobsAndCandidates() {
    const candidates = await db.user.findAll({
        where: { role_id: "39222be4-1f9b-46d8-88d3-d9a83cdaa2d4" },
    });

    const jobs = await db.job_listing.findAll();

    const matches = [];

    for (const candidate of candidates) {
        const { preferred_location, expected_salary } = candidate;

        for (const job of jobs) {
            const candidateSkills = Array.isArray(candidate.skills) ? candidate.skills : [];
            const jobSkills = Array.isArray(job.required_skills) ? job.required_skills : [];

            const skillMatch = hasSkillMatch(candidateSkills, jobSkills);
            const locationMatch = preferred_location?.toLowerCase() === job.location?.toLowerCase();
            const salaryMatch = expected_salary <= job.salary;

            if (skillMatch) {
                const match = {
                    jobId: job.id,
                    candidateId: candidate.id,
                    candidate: candidate.name,
                    job: job.title,
                    jobLocation: job.location,
                    preferredLocation: preferred_location,
                    jobSalary: job.salary,
                    expectedSalary: expected_salary,
                    candidateSkills: candidateSkills,
                    jobSkills: jobSkills,
                };
                console.log(`✅ MATCH FOUND:`, match);
                matches.push(match);

                // Mocked notification
                console.log(`📩 Notify ${candidate.name} about job "${job.title}"`);
            }
        }
    }

    return matches;
}

module.exports = matchJobsAndCandidates;
