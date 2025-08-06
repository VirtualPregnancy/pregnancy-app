// Individual page data imports
import clinicalMidWife from './clinical-mid-wife.js';
import ultrasoundModel from './ultrasound-model.js';
import about from './about.js';
import pregnancyChanges from './pregnancy-changes.js';
import conditionsFetal from './conditions-fetal.js';
import fetalDevelopment from './fetal-development.js';
import rolesOfPlacenta from './roles-of-placenta.js';
import checkBabyHealth from './check-baby-health.js';
import whatIsUltrasound from './what-is-ultrasound.js';
import whenCareChanges from './when-care-changes.js';

// Export page data mapping
export default {
  'clinical-mid-wife': clinicalMidWife,
  'ultrasound-model': ultrasoundModel,
  'about': about,
  'pregnancy-changes': pregnancyChanges,
  'conditions-fetal': conditionsFetal,
  'fetal-development': fetalDevelopment,
  'roles-of-placenta': rolesOfPlacenta,
  'check-baby-health': checkBabyHealth,
  'what-is-ultrasound': whatIsUltrasound,
  'when-care-changes': whenCareChanges
};

// Helper function to get page data by slug
export function getPageData(slug) {
  return this[slug] || null;
}

// Helper function to check if page should show model
export function shouldShowModel(slug) {
  const pageData = this[slug];
  return pageData ? pageData.showModel : false;
}

// Helper function to get all pages that show models
export function getModelPages() {
  return Object.keys(this).filter(slug => this[slug].showModel);
}