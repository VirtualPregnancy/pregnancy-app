<template>
  <div v-if="showDialog" class="search-overlay" @click.self="closeSearch">
    <div class="search-container">
      <v-text-field
        v-model="searchQuery"
        placeholder="Search pages..."
        solo
        flat
        dense
        autofocus
        hide-details
        prepend-inner-icon="mdi-magnify"
        @input="handleSearch"
        @keydown.esc="closeSearch"
        @keydown.enter="handleEnter"
        @keydown.down="handleArrowDown"
        @keydown.up="handleArrowUp"
        class="search-input"
      >
        <template v-slot:append>
          <v-btn icon x-small @click="closeSearch">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-text-field>
      
      <!-- Search Results -->
      <div v-if="searchQuery && filteredPages.length > 0" class="search-results">
        <div
          v-for="(page, index) in filteredPages"
          :key="index"
          @click="navigateToPage(page)"
          :class="['search-result-item', { 'selected': selectedIndex === index }]"
          @mouseenter="selectedIndex = index"
        >
          <div class="result-icon">
            <v-icon small color="primary">{{ page.icon || 'mdi-file-document' }}</v-icon>
          </div>
          <div class="result-content">
            <div class="result-title">{{ page.title }}</div>
            <div v-if="page.category" class="result-category">{{ page.category }}</div>
          </div>
        </div>
      </div>
      
      <!-- No Results -->
      <div v-else-if="searchQuery && filteredPages.length === 0" class="no-results">
        No pages found
      </div>
    </div>
  </div>
</template>

<script>
import topicsData from '~/assets/data/topics.json';
import { getPageData, pageDataMap } from '~/pages/_slug/pageData/pageDataLoader.js';

export default {
  name: 'SearchDialog',
  
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      searchQuery: '',
      filteredPages: [],
      selectedIndex: 0,
      pageDataCache: {},
      isLoadingPageData: false,
    };
  },
  
  computed: {
    allPages() {
      const pages = [];
      
      // Iterate through all topics
      Object.keys(topicsData).forEach(topicKey => {
        const topic = topicsData[topicKey];
        const categoryName = topic.heading;
        
        // Add subtopics as searchable pages
        if (topic.subTopics) {
          Object.keys(topic.subTopics).forEach(subTopicKey => {
            const subTopic = topic.subTopics[subTopicKey];
            const slug = `${topicKey}-${subTopicKey}`;
            
            // Get page data if cached
            const pageData = this.pageDataCache[slug];
            
            const page = {
              title: subTopic.heading,
              slug: slug,
              category: categoryName,
              icon: subTopic.icon || topic.icon || 'mdi-file-document',
              heading: subTopic.heading
            };
            
            // Add searchable content from page data
            if (pageData) {
              page.description = pageData.description || '';
              page.pageTitle = pageData.title || '';
              // Extract searchable text from content sections
              if (pageData.contentSections && pageData.contentSections.length > 0) {
                page.contentSections = pageData.contentSections.map(section => ({
                  title: section.title || '',
                  content: section.content ? this.stripHTML(section.content) : ''
                }));
              }
            }
            
            pages.push(page);
          });
        }
      });
      
      return pages;
    },
    
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  
  async mounted() {
    // Load all page data for search
    await this.loadAllPageData();
  },
  
  watch: {
    showDialog(newVal) {
      if (newVal) {
        // Reset when dialog opens
        this.searchQuery = '';
        this.filteredPages = [];
        this.selectedIndex = 0;
      } else {
        // Also reset when dialog closes
        this.searchQuery = '';
        this.filteredPages = [];
        this.selectedIndex = 0;
      }
    }
  },
  
  methods: {
    async loadAllPageData() {
      this.isLoadingPageData = true;
      
      try {
        // Load all page data using pageDataLoader
        const loadPromises = Object.keys(pageDataMap).map(async (slug) => {
          try {
            const pageData = await getPageData(slug);
            if (pageData) {
              this.pageDataCache[slug] = pageData;
            }
          } catch (error) {
            console.warn(`Failed to load page data for ${slug}:`, error);
          }
        });
        
        await Promise.all(loadPromises);
      } catch (error) {
        console.error('Error loading page data:', error);
      } finally {
        this.isLoadingPageData = false;
      }
    },
    
    stripHTML(html) {
      // Remove HTML tags for searchable text
      return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    },
    
    closeSearch() {
      this.showDialog = false;
      this.searchQuery = '';
      this.filteredPages = [];
    },
    
    handleSearch() {
      if (!this.searchQuery || this.searchQuery.trim() === '') {
        this.filteredPages = [];
        this.selectedIndex = 0;
        return;
      }
      
      const query = this.searchQuery.toLowerCase().trim();
      const results = [];
      
      this.allPages.forEach(page => {
        let matchedSectionIndex = null;
        let matchReason = '';
        
        // Search in basic page info
        if (
          page.title.toLowerCase().includes(query) ||
          page.category.toLowerCase().includes(query) ||
          page.slug.toLowerCase().includes(query) ||
          (page.heading && page.heading.toLowerCase().includes(query))
        ) {
          matchReason = 'title';
        }
        
        // Search in page data content
        else if (page.description && page.description.toLowerCase().includes(query)) {
          matchReason = 'description';
        }
        
        else if (page.pageTitle && page.pageTitle.toLowerCase().includes(query)) {
          matchReason = 'pageTitle';
        }
        
        // Search in content sections
        else if (page.contentSections && page.contentSections.length > 0) {
          const matchedIndex = page.contentSections.findIndex(section => {
            return (
              section.title.toLowerCase().includes(query) ||
              section.content.toLowerCase().includes(query)
            );
          });
          
          if (matchedIndex !== -1) {
            matchedSectionIndex = matchedIndex;
            matchReason = 'content';
          }
        }
        
        // If there's a match, add to results with section index
        if (matchReason) {
          results.push({
            ...page,
            matchedSectionIndex,
            matchReason
          });
        }
      });
      
      this.filteredPages = results;
      
      // Reset selection to first result
      this.selectedIndex = 0;
    },
    
    handleEnter(event) {
      event.preventDefault();
      if (this.filteredPages.length > 0 && this.selectedIndex >= 0) {
        this.navigateToPage(this.filteredPages[this.selectedIndex]);
      }
    },
    
    handleArrowDown(event) {
      event.preventDefault();
      if (this.filteredPages.length > 0) {
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredPages.length - 1);
        this.scrollToSelected();
      }
    },
    
    handleArrowUp(event) {
      event.preventDefault();
      if (this.filteredPages.length > 0) {
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.scrollToSelected();
      }
    },
    
    scrollToSelected() {
      this.$nextTick(() => {
        const selectedElement = this.$el.querySelector('.search-result-item.selected');
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });
    },
    
    navigateToPage(page) {
      // Navigate to the selected page with section index if available
      if (page.matchedSectionIndex !== null && page.matchedSectionIndex !== undefined) {
        // Navigate with query parameter to open specific section
        // Convert 0-based index to 1-based index for ContentPane
        this.$router.push({
          path: `/${page.slug}`,
          query: { index: page.matchedSectionIndex + 1 }
        });
      } else {
        // Navigate without query parameter
        this.$router.push(`/${page.slug}`);
      }
      this.closeSearch();
    },
  }
};
</script>

<style scoped lang="scss">
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 60px;
}

.search-container {
  width: 90%;
  max-width: 420px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  
  // When no results, keep it compact
  &:has(.search-input:only-child) {
    min-height: auto;
  }
}

.search-input {
  flex-shrink: 0;
  
  ::v-deep .v-input__slot {
    box-shadow: none !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0 8px !important;
    min-height: 44px;
  }
  
  ::v-deep .v-input__prepend-inner {
    margin-top: 10px;
    margin-right: 4px;
  }
  
  ::v-deep .v-input__append-inner {
    margin-top: 10px;
    margin-left: 4px;
  }
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 4px;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(221, 60, 81, 0.08);
  }
  
  &.selected {
    background-color: rgba(221, 60, 81, 0.12);
    border: 1px solid rgba(221, 60, 81, 0.3);
    margin: -1px;
  }
}

.result-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  margin-right: 8px;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-category {
  font-size: 0.7rem;
  color: #6b7280;
  margin-top: 1px;
}

.no-results {
  padding: 8px 12px;
  text-align: center;
  color: #9ca3af;
  font-size: 0.85rem;
}
</style>

