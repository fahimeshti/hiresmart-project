const db = require('../models');

function hasSkillMatch(candidateSkills, jobSkills) {
    if (!Array.isArray(candidateSkills) || !Array.isArray(jobSkills)) return false;

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

            if (skillMatch && locationMatch || salaryMatch) {
                const match = {
                    candidate: candidate.name,
                    job: job.title,
                    jobId: job.id,
                    candidateId: candidate.id,
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
