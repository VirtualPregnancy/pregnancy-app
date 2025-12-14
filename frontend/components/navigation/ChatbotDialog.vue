<template>
  <div v-if="showDialog" class="chatbot-overlay p-5" @click.self="closeChatbot">
    <div class="chatbot-container">
      <!-- Chatbot Header -->
      <div class="chatbot-header px-5 py-4">
        <div class="chatbot-title font-semibold text-gray-800">
          <v-icon color="primary" class="mr-2">mdi-robot</v-icon>
          <span>Pregnancy Assistant</span>
        </div>
        <v-btn icon @click="closeChatbot">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      
      <!-- Messages Container -->
      <div class="messages-container p-4 gap-4" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.type]"
        >
          <!-- Bot Message -->
          <div v-if="message.type === 'bot'" class="bot-message gap-2">
            <div class="message-avatar">
              <v-icon color="primary">mdi-robot</v-icon>
            </div>
            <div class="message-content">
              <div class="message-bubble px-4 py-3 text-gray-700 leading-relaxed">
                <div
                  v-for="(text, key) in message.summary"
                  :key="key"
                >{{ text }}</div>
                <div v-html="message.content"></div>
              </div>
              
              <!-- Action Cards -->
              <div v-if="message.actions && message.actions.length > 0" class="action-cards mt-3 gap-2">
                <div
                  v-for="(action, idx) in message.actions.filter(a => a.text || a.description)"
                  :key="idx"
                  class="action-card-item p-3"
                  @click="handleAction(action)"
                >
                  <div class="action-icon mr-3">
                    <v-icon small color="primary">{{ getActionIcon(action.type) }}</v-icon>
                  </div>
                  <div class="action-content">
                    <div v-if="action.query" class="action-title">{{ action.query }}</div>
                    <div v-else class="action-title">{{ action.text }}</div>
                    
                    <div v-if="action.description" class="action-description">{{ action.description }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Related Pages -->
              <div v-if="message.searchResults && message.searchResults.length > 0" class="related-pages mt-4 pt-3">
                <div class="related-pages-header text-xs text-gray-500 mb-2 font-medium">You may also be interested in:</div>
                <div class="related-pages-list text-sm leading-relaxed">
                  <span
                    v-for="(result, idx) in message.searchResults"
                    :key="idx"
                    class="page-link"
                    @click="navigateToPage(result)"
                  >{{ result.title }}<span v-if="idx < message.searchResults.length - 1" class="separator text-gray-400 mx-1"> · </span></span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- User Message -->
          <div v-else-if="message.type === 'user'" class="user-message gap-2">
            <div class="message-content">
              <div class="message-bubble px-4 py-3">{{ message.content }}</div>
            </div>
            <div class="message-avatar">
              <v-icon color="grey">mdi-account</v-icon>
            </div>
          </div>
        </div>
        
        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message bot">
          <div class="bot-message gap-2">
            <div class="message-avatar">
              <v-icon color="primary">mdi-robot</v-icon>
            </div>
            <div class="message-content">
              <div class="typing-indicator gap-1">
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Input Area -->
      <div class="input-area px-5 py-4">
        <v-text-field
          v-model="userInput"
          placeholder="Ask a question about pregnancy, symptoms, or fetal development..."
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
import { getWelcomeMessage, generateChatbotResponse, getAllPagesData } from '~/utils/chatbotUtils.js';

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
    },
    backendApiUrl() {
      return this.$config.publicRuntimeConfig?.backendApiUrl || 'https://pregnancy-app-tau.vercel.app';
    }
  },
  
  mounted() {
    this.addWelcomeMessage();
    
    // Listen for messages from landing page
    this.$root.$on('send-chatbot-message', (message) => {
      if (message && message.trim()) {
        this.userInput = message;
        this.$nextTick(() => {
          this.sendMessage();
        });
      }
    });
  },
  
  beforeDestroy() {
    // Clean up event listener
    this.$root.$off('send-chatbot-message');
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
    getActionIcon(type) {
      const icons = {
        suggestion: 'mdi-lightbulb-outline',
        navigate: 'mdi-arrow-right-circle',
        search: 'mdi-magnify',
        support: 'mdi-heart'
      };
      return icons[type] || 'mdi-arrow-right';
    },
    
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
      
      try {
        // Try AI backend first
        try {
          // Prepare conversation history (last 5 user/assistant pairs)
          const history = this.messages
            .filter(msg => msg.type === 'user' || msg.type === 'bot')
            .slice(-10)  // Last 10 messages (5 pairs)
            .map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            }));
          
          const response = await fetch(`${this.backendApiUrl}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              message: userMessage,
              history: history.length > 0 ? history : undefined
            })
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Deduplicate actions by path
          const deduplicatedActions = this.deduplicateByPath(data.actions || []);
          
          // Add bot response
          this.messages.push({
            type: 'bot',
            content: data.response,
            summary: [],
            searchResults: [],
            actions: deduplicatedActions
          });
        } catch (aiError) {
          console.warn('AI backend failed, falling back to local:', aiError);
          
          // Fallback to local configuration
          const allPages = getAllPagesData();
          const response = generateChatbotResponse(userMessage, allPages);
          
          // Deduplicate actions by path
          const deduplicatedActions = this.deduplicateByPath(response.actions || []);
          
          // Add bot response
          this.messages.push({
            type: 'bot',
            content: response.message,
            summary: response.summary ? Object.values(response.summary) : [],
            searchResults: response.searchResults || [],
            actions: deduplicatedActions
          });
        }
        
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
    
    deduplicateByPath(items) {
      if (!items || items.length === 0) return [];
      
      const seen = new Set();
      const deduplicated = [];
      
      items.forEach(item => {
        // Determine the path identifier
        let pathKey = '';
        
        // For actions with path property
        if (item.path) {
          pathKey = item.path;
        }
        // For searchResults with slug property
        else if (item.slug) {
          pathKey = item.slug;
        }
        // For actions with text that might be used for navigation
        else if (item.text) {
          pathKey = item.text;
        }
        // Default fallback
        else {
          pathKey = JSON.stringify(item);
        }
        
        // Only add if not seen before
        if (!seen.has(pathKey)) {
          seen.add(pathKey);
          deduplicated.push(item);
        }
      });
      
      return deduplicated;
    },
    
    handleAction(action) {
      if (action.type === 'suggestion') {
        this.userInput = action.query || '';
        this.$nextTick(() => {
          this.sendMessage();
        });
      } else if (action.type === 'navigate') {
        this.$router.push(action.path);
        this.closeChatbot();
      }
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
    
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          // Find the last user message
          const messages = container.querySelectorAll('.message.user');
          if (messages.length > 0) {
            const lastUserMessage = messages[messages.length - 1];
            // Scroll to the user message position
            lastUserMessage.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          } else {
            // Fallback to scrolling to bottom if no user messages found
            container.scrollTop = container.scrollHeight;
          }
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
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.chatbot-title {
  display: flex;
  align-items: center;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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
  border-radius: 18px;
  word-wrap: break-word;
}

.user-message .message-bubble {
  background: #3b82f6;
  color: white;
}

.summary-section {
  background: #eff6ff;
  border-left: 3px solid #60a5fa;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}

.summary-item {
  &:not(:last-child) {
    border-bottom: 1px solid #dbeafe;
  }
}

.action-cards {
  display: flex;
  flex-direction: column;
}

.action-card-item {
  display: flex;
  align-items: flex-start;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
  
  &:hover {
    background: #f9fafb;
    border-color: #3b82f6;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
  }
}

.action-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
  min-width: 0;
}

.related-pages {
  border-top: 1px solid #e5e7eb;
}

.page-link {
  color: #3b82f6;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
}

.typing-indicator {
  display: flex;
  align-items: center;
  
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

// Highlight styling for dynamic v-html content
::v-deep .search-highlight {
  background-color: #fef08a;
  color: #854d0e;
  padding: 1px 2px;
  border-radius: 2px;
  font-weight: 600;
}
</style>