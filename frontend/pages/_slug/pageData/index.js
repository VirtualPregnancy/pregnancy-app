// Individual page data imports
import clinicalMidWife from './clinical-mid-wife.js';
import support from './support.js';
import pregnancyChanges from './pregnancy-changes.js';
import conditionsFetal from './conditions-fetal.js';
import fetalDevelopment from './pregnancy-fetal-dev.js';
import rolesOfPlacenta from './pregnancy-placenta.js';
import pregnancyBaby from './pregnancy-baby.js';
import whatIsUltrasound from './ultrasound-what-is-ultrasound.js';
import clinicalWhenCareChanges from './clinical-when-care-changes.js';
import ultrasoundDoppler from './ultrasound-doppler.js';
import ultrasoundHow from './ultrasound-how.js';
import conditionsBirth from './conditions-birth.js';
import conditionsCare from './conditions-care.js';
import keepBabyHealthy from './pregnancy-keep-baby-healthy.js';
import interactWithPlacenta from './pregnancy-interact-with-your-placenta.js';

// Export page data mapping
export default {
  'clinical-mid-wife': clinicalMidWife,
  'clinical-when-care-changes': clinicalWhenCareChanges,
  'support': support,
  'pregnancy-changes': pregnancyChanges,
  'conditions-fetal': conditionsFetal,
  'pregnancy-fetal-dev': fetalDevelopment,
  'pregnancy-placenta': rolesOfPlacenta,
  'pregnancy-baby': pregnancyBaby,
  'ultrasound-doppler': ultrasoundDoppler,
  'ultrasound-what-is-ultrasound': whatIsUltrasound,
  'ultrasound-how': ultrasoundHow,
  'conditions-birth': conditionsBirth,
  'conditions-care': conditionsCare,
  'pregnancy-keep-baby-healthy': keepBabyHealthy,
  'pregnancy-interact-with-your-placenta': interactWithPlacenta
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