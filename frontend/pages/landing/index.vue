<template>
  <v-app :class="mdAndUp ? 'landing-page' : 'landing-page-md'">
    <!-- Hamburger Menu Icon -->
    <div class="hamburger-menu fixed top-5 left-5 z-50">
      <Menu />
    </div>
    
    
    <!-- Top-Bottom Layout -->
    <div class="landing-container">
      
      <!-- Top Section - Title and Description -->
      <div class="top-section">
        <div class="top-content">
          
          <h1 class="main-title">
            {{ landingPageData.title }}
          </h1>
          <p class="intro-text">
            {{ landingPageData.description }}
          </p>
          
          <!-- Chat Input Box -->
          <div class="chat-input-container">
            <v-text-field
              v-model="userMessage"
              solo
              flat
              rounded
              placeholder="Ask a question about pregnancy, symptoms, or fetal development..."
              append-icon="mdi-send"
              @click:append="handleChatInput"
              @keydown.enter="handleChatInput"
              @focus="focusInput"
              class="chat-input-field"
              prepend-inner-icon="mdi-chat-question"
              hide-details
            ></v-text-field>
          </div>
        </div>
      </div>

      <!-- Bottom Section - Cards in Rows -->
      <div class="bottom-section">
        <div class="cards-grid">
          <div 
            v-for="item in landingPageData.items" 
            :key="item.title"
            class="card-item"
            :style="{ backgroundColor: item.backgroundColor }"
            @click="navigateToPage(item.link)"
          >
            <div class="card-icon">
              <img 
                :src="getImagePath(item.image)" 
                :alt="item.title"
                @error="onImageError"
              />
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-description">{{ item.description }}</p>
            </div>
          </div>
        </div>
        
      </div>
      <div class="mb-6">
        <Logo />
      </div>

    </div>
    
    <!-- Chatbot Floating Button -->
    <div class="chatbot-fab">
      <v-btn
        fab
        large
        color="primary"
        @click="showChatbotDialog = true"
        title="Chat with Pregnancy Assistant"
        class="chatbot-button"
      >
        <v-icon>mdi-robot</v-icon>
      </v-btn>
    </div>
    <ChatbotDialog v-model="showChatbotDialog" />
  </v-app>
</template>

<script>
import landingPageData from '@/assets/data/landingPageData.json';
import Menu from '@/components/landing/Menu.vue';
import Logo from '@/components/Logo.vue';
import ChatbotDialog from '@/components/navigation/ChatbotDialog.vue';
export default {
  layout: 'empty',
  components: {
    Menu,
    Logo,
    ChatbotDialog
  },
  data() {
    return {
      landingPageData: landingPageData,
      showChatbotDialog: false,
      userMessage: '',
      pendingMessage: null
    }
  },
  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },
  
  methods: {
    navigateToPage(link) {
      if (link) {
        this.$router.push(link);
      }
    },
    
    getImagePath(imagePath) {
      const basePath = this.$config.basePath || '';
      // Ensure we don't double-add the base path
      const cleanPath = imagePath.replace(/^\/pregnancy-app/, '');
      return basePath + cleanPath;
    },
    
    forceImageReload() {
      // Force recomputation of computed properties
      this.$forceUpdate();
      
      // Add a small delay and try to reload images that failed
      setTimeout(() => {
        const images = this.$el.querySelectorAll('img');
        images.forEach(img => {
          if (!img.complete || img.naturalWidth === 0) {
            const src = img.src;
            img.src = '';
            img.src = src;
          }
        });
      }, 100);
    },
    
    onImageError(event) {
      console.error('Image failed to load:', event.target.src);
      // Set a fallback or hide the image instead of retrying
      event.target.style.display = 'none';
    },
    toggleChatbot() {
      this.showChatbotDialog = true;
    },
    
    focusInput() {
      // Optional: could show a hint or animation when user focuses
    },
    
    handleChatInput() {
      if (this.userMessage.trim()) {
        // Store the message to send to chatbot
        this.pendingMessage = this.userMessage.trim();
        // Clear the input
        this.userMessage = '';
        // Open chatbot dialog
        this.showChatbotDialog = true;
        
        // Wait for dialog to open then send message
        this.$nextTick(() => {
          // Use a ref or event to trigger message send in ChatbotDialog
          this.$root.$emit('send-chatbot-message', this.pendingMessage);
        });
      } else {
        // Just open the chatbot if no message
        this.showChatbotDialog = true;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.landing-page {
  background: var(--v-backgroundAlt-base);
  min-height: 100vh;
}
.landing-page-md {
  margin-top: 30px;
  box-sizing: border-box;
}

.hamburger-menu {
  background: var(--v-background-base);
  backdrop-filter: blur(10px);
  border: 1px solid var(--v-background-base);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 8px;
  
  &:hover {
    background: var(--v-secondary-base);
    color: white;
    box-shadow: 0 6px 25px rgba(49, 54, 87, 0.3);
  }
}

.search-button {
  .v-btn {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
    }
  }
}

.landing-container {
  min-height: 100vh;
  width: 100vw;
  background: var(--v-backgroundAlt-base);
  display: flex;
  flex-direction: column;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(221, 60, 81, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(108, 144, 185, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(31, 102, 131, 0.05) 0%, transparent 50%);
    z-index: 0;
  }
}

/* Top Section Styles */
.top-section {
  flex: 0 0 auto;
  padding: 4rem 2rem 2rem;
  position: relative;
  z-index: 1;
}

.top-content {
  margin: 0 auto;
  text-align: center;
}

.main-title {
  font-size: 3rem;
  font-weight: bold;
  color: var(--v-primary-base);
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  .title-gradient {
    display: block;
    background: var(--v-info-base);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5em;
  }
  
  .title-highlight {
    display: block;
    background: var(--v-accent-base);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: glow 2s ease-in-out infinite alternate;
  }
}

.intro-text {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--v-info-base);
  margin: 0 auto 2rem;
}

.chat-input-container {
  max-width: 700px;
  margin: 2rem auto 0;
  width: 100%;
}

.chat-input-field {
  ::v-deep .v-input__slot {
    background: white !important;
    box-shadow: 0 6px 20px rgba(221, 60, 81, 0.15) !important;
    border: 2px solid var(--v-primary-base) !important;
    font-size: 1rem;
    padding: 12px 12px !important;
    transition: all 0.3s ease;
  }
  
  ::v-deep .v-input__slot:hover {
    box-shadow: 0 8px 30px rgba(221, 60, 81, 0.25) !important;
  }
  
  ::v-deep .v-input__slot:focus-within {
    box-shadow: 0 8px 35px rgba(221, 60, 81, 0.3) !important;
    border-color: var(--v-accent-base);
  }
  
  ::v-deep input {
    font-size: 1.05rem;
    color: var(--v-info-base);
  }
  
  ::v-deep input::placeholder {
    color: rgba(49, 54, 87, 0.5);
  }
  
  ::v-deep .v-input__prepend-inner {
    margin-right: 12px;
    color: var(--v-primary-base);
  }
  
  ::v-deep .v-input__append-inner {
    color: var(--v-primary-base);
    cursor: pointer;
    
    .v-icon:hover {
      transform: scale(1.1);
      transition: transform 0.2s ease;
    }
  }
}

/* Bottom Section Styles */
.bottom-section {
  flex: 1;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.cards-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.card-item {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-height: 120px;
  width: 100%;
  max-width: 400px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
}

.card-icon {
  flex: 0 0 80px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  
  img {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
}

.card-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.card-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;    
  line-height: 1.4;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .intro-text {
    font-size: 1.1rem;
  }
  
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .landing-page {
    height: auto;
    overflow-y: auto;
  }
  
  .landing-container {
    height: auto;
    min-height: 100vh;
  }
  
  .top-section {
    padding: 3rem 1rem 1.5rem;
  }
  
  .bottom-section {
    padding: 1rem;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .intro-text {
    font-size: 1rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .card-item {
    min-height: 100px;
    max-width: none;
  }
  
  .card-icon {
    flex: 0 0 60px;
    
    img {
      width: 40px;
      height: 40px;
    }
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-description {
    font-size: 0.9rem;
  }
  
  .hamburger-menu {
    top: 10px;
    left: 10px;
  }
  
  .chat-input-container {
    margin-top: 1.5rem;
  }
  
  .chat-input-field {
    ::v-deep .v-input__slot {
      padding: 10px 20px !important;
    }
    
    ::v-deep input {
      font-size: 0.95rem !important;
    }
  }
  
  .input-hint {
    font-size: 0.8rem;
  }
  
  .chatbot-button {
    width: 56px !important;
    height: 56px !important;
  }
}

@media (max-width: 480px) {
  .top-section {
    padding: 2rem 1rem 1rem;
  }
  
  .main-title {
    font-size: 1.75rem;
  }
  
  .intro-text {
    font-size: 0.95rem;
  }
  
  .chat-input-container {
    margin-top: 1rem;
  }
  
  .chat-input-field {
    ::v-deep .v-input__slot {
      padding: 8px 16px !important;
    }
    
    ::v-deep input {
      font-size: 0.9rem !important;
    }
  }
  
  .input-hint {
    font-size: 0.75rem;
    margin-top: 8px;
  }
  
  .card-item {
    min-height: 90px;
  }
  
  .card-icon {
    flex: 0 0 50px;
    
    img {
      width: 30px;
      height: 30px;
    }
  }
}

/* Chatbot Floating Button */
.chatbot-fab {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.chatbot-button {
  box-shadow: 0 6px 25px rgba(221, 60, 81, 0.4) !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-4px) scale(1.05) !important;
    box-shadow: 0 8px 35px rgba(221, 60, 81, 0.5) !important;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    background: rgba(221, 60, 81, 0.3);
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .chatbot-fab {
    bottom: 20px;
    right: 20px;
  }
  
  .chatbot-button {
    width: 56px !important;
    height: 56px !important;
    
    ::v-deep .v-icon {
      font-size: 24px !important;
    }
  }
}
</style>