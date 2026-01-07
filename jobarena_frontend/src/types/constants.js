/**
 * Shared domain constants for the Jobarena frontend.
 * Centralizing these avoids duplicating string literals across UI and data layer.
 */

/** @type {import('./job').JobType[]} */
export const JOB_TYPES = Object.freeze(['Full-time', 'Part-time', 'Contract', 'Internship']);

/** @type {import('./job').ExperienceLevel[]} */
export const EXPERIENCE_LEVELS = Object.freeze(['Entry', 'Mid', 'Senior', 'Lead']);
