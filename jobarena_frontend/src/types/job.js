/**
 * Shared domain types (JSDoc) for the Jobarena frontend.
 * This project uses plain JS; these typedefs improve editor support and readability.
 */

/**
 * @typedef {'Full-time'|'Part-time'|'Contract'|'Internship'} JobType
 */

/**
 * @typedef {'Entry'|'Mid'|'Senior'|'Lead'} ExperienceLevel
 */

/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {string} title
 * @property {string} company
 * @property {string} location
 * @property {JobType} type
 * @property {ExperienceLevel} experience
 * @property {string} salaryRange
 * @property {string} postedAtISO - ISO date string
 * @property {string[]} tags
 * @property {string} description
 */

/**
 * @typedef {Object} JobSearchFilters
 * @property {string} query
 * @property {string[]} locations
 * @property {JobType[]} jobTypes
 * @property {ExperienceLevel[]} experienceLevels
 */
