// JSON-based page data loader
import pageDataMap from './json/index.json';

// Load page data from JSON files
async function loadPageData(slug) {
  try {
    const fileName = pageDataMap[slug];
    if (!fileName) {
      return null;
    }
    
    const module = await import(`./json/${fileName}`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load page data for slug: ${slug}`, error);
    return null;
  }
}

// Helper function to get page data by slug
export async function getPageData(slug) {
  return await loadPageData(slug);
}

// Helper function to check if page should show model
export async function shouldShowModel(slug) {
  const pageData = await loadPageData(slug);
  return pageData ? pageData.showModel : false;
}

// Helper function to get all pages that show models
export async function getModelPages() {
  const modelPages = [];
  for (const slug of Object.keys(pageDataMap)) {
    const pageData = await loadPageData(slug);
    if (pageData && pageData.showModel) {
      modelPages.push(slug);
    }
  }
  return modelPages;
}

// Export the page data map for synchronous access when needed
export { pageDataMap };
