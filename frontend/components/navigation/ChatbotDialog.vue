<template>
  <div v-if="showDialog" class="chatbot-overlay" @click.self="closeChatbot">
    <div class="chatbot-container">
      <!-- Chatbot Header -->
      <div class="chatbot-header">
        <div class="chatbot-title">
          <v-icon color="primary" class="mr-2">mdi-robot</v-icon>
          <span>Pregnancy Assistant</span>
        </div>
        <v-btn icon @click="closeChatbot">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      
      <!-- Messages Container -->
      <div class="messages-container" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.type]"
        >
          <!-- Bot Message -->
          <div v-if="message.type === 'bot'" class="bot-message">
            <div class="message-avatar">
              <v-icon color="primary">mdi-robot</v-icon>
            </div>
            <div class="message-content">
              <div class="message-bubble" v-html="message.content"></div>
              
              <!-- Search Results -->
              <div v-if="message.searchResults && message.searchResults.length > 0" class="search-results">
                <div
                  v-for="(result, idx) in message.searchResults"
                  :key="idx"
                  class="search-result-item"
                  @click="navigateToPage(result)"
                >
                  <div class="result-icon">
                    <v-icon small color="primary">{{ result.icon || 'mdi-file-document' }}</v-icon>
                  </div>
                  <div class="result-content">
                    <div class="result-title" v-html="result.highlightedTitle || result.title"></div>
                    <div v-if="result.category" class="result-category" v-html="result.highlightedCategory || result.category"></div>
                    <div v-if="result.matchedSnippet" class="result-snippet" v-html="result.matchedSnippet"></div>
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div v-if="!message.searchResults && message.actions && message.actions.length > 0" class="action-buttons">
                <v-btn
                  v-for="(action, idx) in message.actions"
                  :key="idx"
                  small
                  outlined
                  color="primary"
                  class="action-btn"
                  @click="handleAction(action)"
                >
                  {{ action.text }}
                </v-btn>
              </div>
            </div>
          </div>
          
          <!-- User Message -->
          <div v-else-if="message.type === 'user'" class="user-message">
            <div class="message-content">
              <div class="message-bubble">{{ message.content }}</div>
            </div>
            <div class="message-avatar">
              <v-icon color="grey">mdi-account</v-icon>
            </div>
          </div>
        </div>
        
        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message bot">
          <div class="bot-message">
            <div class="message-avatar">
              <v-icon color="primary">mdi-robot</v-icon>
            </div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Input Area -->
      <div class="input-area">
        <v-text-field
          v-model="userInput"
          placeholder="Ask me anything about pregnancy..."
          solo
          flat
          dense
          hide-details
          @keydown.enter="sendMessage"
          @keydown.esc="closeChatbot"
          class="chat-input"
          ref="chatInput"
        >
          <template v-slot:append>
            <v-btn
              icon
              color="primary"
              @click="sendMessage"
              :disabled="!userInput.trim()"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
    </div>
  </div>
</template>

<script>
import { generateChatbotResponse, getAllPagesData, getWelcomeMessage, handleChatbotAction } from '~/utils/chatbotUtils.js';

export default {
  name: 'ChatbotDialog',
  
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      userInput: '',
      messages: [],
      isTyping: false,
      pageDataCache: {},
      isLoadingPageData: false,
    };
  },
  
  computed: {
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  
  mounted() {
    this.addWelcomeMessage();
  },
  
  watch: {
    showDialog(newVal) {
      if (newVal) {
        this.userInput = '';
        this.scrollToBottom();
      }
    }
  },
  
  methods: {
    addWelcomeMessage() {
      this.messages.push(getWelcomeMessage());
    },
    
    async sendMessage() {
      if (!this.userInput.trim()) return;
      
      const userMessage = this.userInput.trim();
      this.userInput = '';
      
      // Add user message
      this.messages.push({
        type: 'user',
        content: userMessage
      });
      
      this.scrollToBottom();
      this.isTyping = true;
      
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        // Use utils for response generation
        const allPages = getAllPagesData();
        let response = generateChatbotResponse(userMessage, allPages);
        
        // Add bot response
        this.messages.push({
          type: 'bot',
          content: response.message,
          searchResults: response.searchResults,
          actions: response.actions
        });
        
      } catch (error) {
        console.error('Error processing message:', error);
        this.messages.push({
          type: 'bot',
          content: "I'm sorry, I encountered an error. Please try again.",
          actions: [
            { type: 'suggestion', text: 'Try a different question', query: 'help' }
          ]
        });
      }
      
      this.isTyping = false;
      this.scrollToBottom();
    },
    
    // Response logic moved to utils/chatbotUtils.js
    
    handleAction(action) {
      handleChatbotAction(
        action,
        (query) => { this.userInput = query; },
        () => { this.sendMessage(); },
        (path) => { this.$router.push(path); },
        () => { this.closeChatbot(); }
      );
    },
    
    navigateToPage(page) {
      if (page.matchedSectionIndex !== null && page.matchedSectionIndex !== undefined) {
        this.$router.push({
          path: `/${page.slug}`,
          query: { index: page.matchedSectionIndex + 1 }
        });
      } else {
        this.$router.push(`/${page.slug}`);
      }
      this.closeChatbot();
    },
    
    // Simplified - no external data loading needed
    
    // Page data logic moved to utils/chatbotUtils.js
    
    stripHTML(html) {
      return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    
    closeChatbot() {
      this.showDialog = false;
    }
  }
};
</script>

<style scoped lang="scss">
.chatbot-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.chatbot-container {
  width: 100%;
  max-width: 600px;
  height: 80vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chatbot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.chatbot-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #1f2937;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  
  &.user {
    justify-content: flex-end;
  }
  
  &.bot {
    justify-content: flex-start;
  }
}

.bot-message, .user-message {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 80%;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-bubble {
  background: #f3f4f6;
  padding: 12px 16px;
  border-radius: 18px;
  color: #374151;
  line-height: 1.5;
  word-wrap: break-word;
}

.user-message .message-bubble {
  background: #3b82f6;
  color: white;
}

.search-results {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-result-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
    border-color: #3b82f6;
  }
}

.result-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.result-category {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 4px;
}

.result-snippet {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.4;
}

.action-buttons {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-btn {
  margin: 0;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #9ca3af;
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.input-area {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.chat-input {
  ::v-deep .v-input__slot {
    box-shadow: none !important;
    border: 1px solid #d1d5db;
    border-radius: 24px;
    padding: 0 16px !important;
  }
  
  ::v-deep .v-input__slot:focus-within {
    border-color: #3b82f6;
  }
}

// Highlight styling
::v-deep .search-highlight {
  background-color: #fef08a;
  color: #854d0e;
  padding: 1px 2px;
  border-radius: 2px;
  font-weight: 600;
}
</style>
