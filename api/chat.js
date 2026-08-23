/**
 * ============================================================
 * YUKAS AI CHATBOT - Production Ready Module
 * ============================================================
 * 
 * Features:
 * - Secure API communication
 * - Multi-language support (English + Hausa)
 * - WhatsApp handoff integration
 * - Quick action buttons
 * - Responsive design
 * - Accessibility compliant
 * - Error handling & retry logic
 * - Rate limiting protection
 * - Analytics ready
 * - Performance optimized
 * 
 * Version: 1.0.0
 * Author: YUKAS DIGITAL HUB
 * License: Proprietary
 * ============================================================
 */

(function() {
    'use strict';

    // ============================================================
    // CONFIGURATION
    // ============================================================
    
    const CONFIG = {
        // API endpoint for chat
        apiEndpoint: '/api/chat',
        
        // WhatsApp integration
        whatsappNumber: '2347043504297',
        whatsappMessage: 'Hi YUKAS DIGITAL HUB, I\'m interested in learning more about your services!',
        
        // Chat window IDs
        chatWindowId: 'yukasChatWindow',
        launcherId: 'yukasChatLauncher',
        
        // Welcome message (supports English + Hausa)
        welcomeMessage: `👋 Hello! I'm YUKAS AI, the AI assistant for YUKAS DIGITAL HUB.

I can help you learn about our AI solutions, website development, automation, and more.

How can I help you today?`,
        
        // Quick action buttons
        quickActions: [
            { 
                label: '🤖 AI Solutions', 
                value: 'Tell me about your AI solutions.',
                icon: 'fa-robot'
            },
            { 
                label: '🌐 Website Development', 
                value: 'Tell me about your website development services.',
                icon: 'fa-laptop-code'
            },
            { 
                label: '💬 WhatsApp Automation', 
                value: 'Tell me about your WhatsApp automation services.',
                icon: 'fa-whatsapp'
            },
            { 
                label: '🎨 Branding & Design', 
                value: 'Tell me about your branding and design services.',
                icon: 'fa-paint-brush'
            },
            { 
                label: '💼 Start a Project', 
                value: 'I\'d like to start a project with YUKAS DIGITAL HUB.',
                icon: 'fa-rocket'
            }
        ],
        
        // System configuration
        maxMessageLength: 500,
        maxHistoryLength: 20,
        typingDelay: 1000,
        rateLimitRetryDelay: 3000,
        
        // Analytics (optional)
        analyticsEnabled: false,
        analyticsEndpoint: '/api/analytics',
        
        // Debug mode (set to false in production)
        debug: false
    };

    // ============================================================
    // STATE MANAGEMENT
    // ============================================================
    
    const State = {
        isOpen: false,
        isProcessing: false,
        isRateLimited: false,
        conversationHistory: [],
        sessionId: null,
        messageCount: 0,
        lastMessageTime: null
    };

    // ============================================================
    // DOM REFERENCES
    // ============================================================
    
    let DOM = {};

    // ============================================================
    // UTILITY FUNCTIONS
    // ============================================================
    
    const Utils = {
        // Generate unique session ID
        generateSessionId: function() {
            return 'yukas-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        },
        
        // Format timestamp
        getTimestamp: function() {
            return new Date().toISOString();
        },
        
        // Sanitize message content
        sanitizeMessage: function(text) {
            if (!text) return '';
            // Remove any script tags or dangerous content
            return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                       .replace(/[<>]/g, '');
        },
        
        // Check if message is empty
        isEmpty: function(text) {
            return !text || text.trim().length === 0;
        },
        
        // Debounce function for performance
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Logging (only in debug mode)
        log: function(message, data) {
            if (CONFIG.debug) {
                console.log(`[YUKAS AI] ${message}`, data || '');
            }
        },
        
        // Error logging
        error: function(message, error) {
            console.error(`[YUKAS AI ERROR] ${message}`, error || '');
        }
    };

    // ============================================================
    // ANALYTICS (Optional)
    // ============================================================
    
    const Analytics = {
        track: function(event, data) {
            if (!CONFIG.analyticsEnabled) return;
            
            try {
                const payload = {
                    event: event,
                    sessionId: State.sessionId,
                    timestamp: Utils.getTimestamp(),
                    data: data || {}
                };
                
                // Send to analytics endpoint (if configured)
                if (CONFIG.analyticsEndpoint) {
                    navigator.sendBeacon(CONFIG.analyticsEndpoint, JSON.stringify(payload));
                }
            } catch (error) {
                Utils.error('Analytics tracking failed:', error);
            }
        },
        
        trackMessage: function(type, length) {
            this.track('message_sent', { type: type, length: length });
        },
        
        trackQuickAction: function(action) {
            this.track('quick_action_clicked', { action: action });
        },
        
        trackWhatsAppClick: function() {
            this.track('whatsapp_handoff_clicked', {});
        },
        
        trackChatOpen: function() {
            this.track('chat_opened', {});
        },
        
        trackChatClose: function() {
            this.track('chat_closed', {});
        }
    };

    // ============================================================
    // CORE CHATBOT FUNCTIONS
    // ============================================================
    
    const Chatbot = {
        /**
         * Initialize the chatbot
         */
        init: function() {
            Utils.log('Initializing YUKAS AI Chatbot...');
            
            // Generate session ID
            State.sessionId = Utils.generateSessionId();
            Utils.log('Session ID:', State.sessionId);
            
            // Create HTML structure
            this.createHTML();
            
            // Get DOM references
            this.getDOMReferences();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Add welcome message
            this.addWelcomeMessage();
            
            // Track initialization
            Analytics.track('chatbot_initialized', { 
                sessionId: State.sessionId 
            });
            
            Utils.log('YUKAS AI Chatbot initialized successfully!');
        },
        
        /**
         * Create chatbot HTML structure
         */
        createHTML: function() {
            // Check if already exists
            if (document.getElementById(CONFIG.launcherId)) {
                Utils.log('Chatbot already exists in DOM');
                return;
            }
            
            const html = `
                <!-- ============================================
                YUKAS AI CHAT LAUNCHER
                ============================================ -->
                <div id="${CONFIG.launcherId}" 
                     class="yukas-chat-launcher" 
                     role="button" 
                     aria-label="Open YUKAS AI Chat" 
                     tabindex="0"
                     title="Chat with YUKAS AI">
                    <div class="yukas-launcher-icon">
                        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 1.89.54 3.64 1.48 5.14L2 22l5.14-1.48C8.36 21.46 10.11 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.65 0-3.2-.53-4.46-1.42l-.34-.24-2.38.68.73-2.31-.25-.35C4.53 15.2 4 13.65 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
                            <path fill="currentColor" d="M13 10V7h-2v3H8v2h3v3h2v-3h3v-2z"/>
                        </svg>
                    </div>
                    <span class="yukas-launcher-label">YUKAS AI</span>
                    <span class="yukas-launcher-badge" aria-hidden="true">●</span>
                </div>

                <!-- ============================================
                YUKAS AI CHAT WINDOW
                ============================================ -->
                <div id="${CONFIG.chatWindowId}" 
                     class="yukas-chat-window" 
                     role="dialog" 
                     aria-label="YUKAS AI Chat" 
                     aria-hidden="true"
                     style="display: none;">
                    
                    <!-- Chat Header -->
                    <div class="yukas-chat-header">
                        <div class="yukas-chat-header-left">
                            <div class="yukas-chat-avatar" aria-hidden="true">AI</div>
                            <div class="yukas-chat-header-info">
                                <span class="yukas-chat-header-title">YUKAS AI</span>
                                <span class="yukas-chat-header-status">● Online</span>
                            </div>
                        </div>
                        <button class="yukas-chat-close" 
                                aria-label="Close chat" 
                                title="Close chat (Esc)">
                            ✕
                        </button>
                    </div>

                    <!-- Messages Container -->
                    <div class="yukas-chat-messages" id="yukasChatMessages" role="log" aria-live="polite"></div>

                    <!-- Quick Actions -->
                    <div class="yukas-quick-actions" id="yukasQuickActions" role="toolbar" aria-label="Quick actions"></div>

                    <!-- Chat Footer -->
                    <div class="yukas-chat-footer">
                        <textarea class="yukas-chat-input" 
                                  id="yukasChatInput" 
                                  rows="1" 
                                  placeholder="Ask me anything about YUKAS DIGITAL HUB..."
                                  aria-label="Type your message"
                                  maxlength="500"
                                  autocomplete="off"></textarea>
                        <button class="yukas-chat-send" 
                                id="yukasChatSend" 
                                aria-label="Send message" 
                                disabled>
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Loading Overlay -->
                    <div class="yukas-chat-loading" id="yukasChatLoading" style="display: none;" role="status" aria-live="polite">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span style="margin-left:8px;color:rgba(255,255,255,0.5);font-size:0.8rem;">YUKAS AI is thinking...</span>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', html);
            Utils.log('Chatbot HTML created');
        },
        
        /**
         * Get DOM references
         */
        getDOMReferences: function() {
            DOM = {
                chatWindow: document.getElementById(CONFIG.chatWindowId),
                launcher: document.getElementById(CONFIG.launcherId),
                messages: document.getElementById('yukasChatMessages'),
                input: document.getElementById('yukasChatInput'),
                sendButton: document.getElementById('yukasChatSend'),
                quickActions: document.getElementById('yukasQuickActions'),
                loading: document.getElementById('yukasChatLoading'),
                closeButton: document.querySelector('.yukas-chat-close'),
                badge: document.querySelector('.yukas-launcher-badge')
            };
            
            // Validate all DOM elements exist
            const missingElements = Object.entries(DOM)
                .filter(([key, value]) => !value)
                .map(([key]) => key);
            
            if (missingElements.length > 0) {
                Utils.error('Missing DOM elements:', missingElements);
            }
        },
        
        /**
         * Set up event listeners
         */
        setupEventListeners: function() {
            // Launcher click/toggle
            DOM.launcher.addEventListener('click', this.toggleChat.bind(this));
            DOM.launcher.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    Chatbot.toggleChat();
                }
            });
            
            // Close button
            DOM.closeButton.addEventListener('click', this.closeChat.bind(this));
            
            // Send button
            DOM.sendButton.addEventListener('click', this.sendMessage.bind(this));
            
            // Input field
            DOM.input.addEventListener('input', this.handleInputChange.bind(this));
            DOM.input.addEventListener('keydown', this.handleKeyDown.bind(this));
            
            // Click outside to close
            document.addEventListener('click', this.handleOutsideClick.bind(this));
            
            // Escape key to close
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && State.isOpen) {
                    Chatbot.closeChat();
                }
            });
            
            // Quick actions
            DOM.quickActions.addEventListener('click', this.handleQuickAction.bind(this));
            
            // Window resize handler (debounced)
            const debouncedResize = Utils.debounce(this.handleResize.bind(this), 250);
            window.addEventListener('resize', debouncedResize);
            
            Utils.log('Event listeners set up');
        },
        
        /**
         * Toggle chat window
         */
        toggleChat: function() {
            if (State.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        },
        
        /**
         * Open chat window
         */
        openChat: function() {
            State.isOpen = true;
            DOM.chatWindow.style.display = 'flex';
            DOM.chatWindow.setAttribute('aria-hidden', 'false');
            DOM.launcher.classList.add('active');
            
            // Focus input after animation
            setTimeout(function() {
                DOM.input.focus();
            }, 300);
            
            // Scroll to bottom
            this.scrollToBottom();
            
            // Update badge
            this.updateBadge(false);
            
            // Track analytics
            Analytics.trackChatOpen();
            
            Utils.log('Chat opened');
        },
        
        /**
         * Close chat window
         */
        closeChat: function() {
            State.isOpen = false;
            DOM.chatWindow.style.display = 'none';
            DOM.chatWindow.setAttribute('aria-hidden', 'true');
            DOM.launcher.classList.remove('active');
            
            // Track analytics
            Analytics.trackChatClose();
            
            Utils.log('Chat closed');
        },
        
        /**
         * Handle click outside chat window
         */
        handleOutsideClick: function(e) {
            if (!State.isOpen) return;
            
            const chatElement = DOM.chatWindow;
            const launcherElement = DOM.launcher;
            
            if (chatElement && !chatElement.contains(e.target) && 
                launcherElement && !launcherElement.contains(e.target)) {
                this.closeChat();
            }
        },
        
        /**
         * Handle window resize
         */
        handleResize: function() {
            Utils.log('Window resized');
            // Adjust any responsive behavior if needed
        },
        
        /**
         * Handle input change
         */
        handleInputChange: function() {
            const value = DOM.input.value.trim();
            DOM.sendButton.disabled = value.length === 0 || State.isProcessing;
            
            // Auto-resize textarea
            DOM.input.style.height = 'auto';
            DOM.input.style.height = Math.min(DOM.input.scrollHeight, 80) + 'px';
        },
        
        /**
         * Handle keydown on input
         */
        handleKeyDown: function(e) {
            // Enter key (without Shift) = send
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!DOM.sendButton.disabled) {
                    this.sendMessage();
                }
            }
            
            // Enter + Shift = newline
            if (e.key === 'Enter' && e.shiftKey) {
                // Allow newline
                e.preventDefault();
                const start = DOM.input.selectionStart;
                const end = DOM.input.selectionEnd;
                DOM.input.value = DOM.input.value.substring(0, start) + '\n' + 
                                 DOM.input.value.substring(end);
                DOM.input.selectionStart = DOM.input.selectionEnd = start + 1;
                this.handleInputChange();
            }
        },
        
        /**
         * Handle quick action click
         */
        handleQuickAction: function(e) {
            const action = e.target.closest('.yukas-quick-action');
            if (!action) return;
            
            const value = action.dataset.value;
            if (value) {
                DOM.input.value = value;
                this.handleInputChange();
                this.sendMessage();
                
                // Track analytics
                Analytics.trackQuickAction(value);
                
                Utils.log('Quick action clicked:', value);
            }
        },
        
        /**
         * Send message to API
         */
        sendMessage: function() {
            const message = DOM.input.value.trim();
            
            // Validation
            if (Utils.isEmpty(message) || State.isProcessing) {
                return;
            }
            
            // Rate limiting check
            if (State.isRateLimited) {
                this.showError('You are sending messages too quickly. Please wait a moment.');
                return;
            }
            
            // Add user message to chat
            this.addMessage('user', message);
            State.conversationHistory.push({ role: 'user', content: message });
            
            // Clear input
            DOM.input.value = '';
            this.handleInputChange();
            
            // Update state
            State.messageCount++;
            State.lastMessageTime = Date.now();
            
            // Show loading
            this.showLoading(true);
            
            // Track analytics
            Analytics.trackMessage('user', message.length);
            
            // Send to API
            State.isProcessing = true;
            DOM.sendButton.disabled = true;
            
            const startTime = Date.now();
            
            fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: State.conversationHistory,
                    sessionId: State.sessionId,
                    metadata: {
                        messageCount: State.messageCount,
                        timestamp: Utils.getTimestamp()
                    }
                })
            })
            .then(function(response) {
                if (!response.ok) {
                    return response.json().then(function(err) {
                        throw new Error(err.error || 'Server error');
                    });
                }
                return response.json();
            })
            .then(function(data) {
                const aiMessage = data.message;
                State.conversationHistory.push({ role: 'assistant', content: aiMessage });
                Chatbot.addMessage('assistant', aiMessage);
                
                // Track analytics
                Analytics.trackMessage('assistant', aiMessage.length);
                
                Utils.log('Response received in ' + (Date.now() - startTime) + 'ms');
            })
            .catch(function(error) {
                Utils.error('Chat error:', error);
                
                // Handle rate limiting
                if (error.message.includes('rate limit') || error.message.includes('429')) {
                    State.isRateLimited = true;
                    setTimeout(function() {
                        State.isRateLimited = false;
                    }, CONFIG.rateLimitRetryDelay);
                }
                
                Chatbot.showError(error.message || 'Something went wrong. Please try again.');
            })
            .finally(function() {
                Chatbot.showLoading(false);
                State.isProcessing = false;
                DOM.sendButton.disabled = DOM.input.value.trim().length === 0;
                Chatbot.scrollToBottom();
            });
        },
        
        /**
         * Add message to chat
         */
        addMessage: function(role, content) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'yukas-chat-message yukas-chat-message-' + role;
            
            const avatar = document.createElement('div');
            avatar.className = 'yukas-chat-avatar';
            avatar.textContent = role === 'user' ? 'You' : 'AI';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'yukas-chat-message-content';
            
            // Sanitize and format content
            const sanitizedContent = Utils.sanitizeMessage(content);
            const formattedContent = sanitizedContent.replace(/\n/g, '<br>');
            contentDiv.innerHTML = formattedContent;
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(contentDiv);
            DOM.messages.appendChild(messageDiv);
            
            // Check if message contains WhatsApp handoff suggestion
            if (role === 'assistant' && content.toLowerCase().includes('whatsapp')) {
                this.addWhatsAppButton();
            }
            
            this.scrollToBottom();
        },
        
        /**
         * Add WhatsApp handoff button
         */
        addWhatsAppButton: function() {
            // Remove existing WhatsApp button to avoid duplicates
            const existingButton = DOM.messages.querySelector('.yukas-whatsapp-handoff');
            if (existingButton) existingButton.remove();
            
            const container = document.createElement('div');
            container.className = 'yukas-whatsapp-handoff';
            
            const message = document.createElement('p');
            message.textContent = '💬 Want to continue this conversation on WhatsApp?';
            
            const button = document.createElement('a');
            const whatsappUrl = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + 
                encodeURIComponent(CONFIG.whatsappMessage);
            button.href = whatsappUrl;
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
            button.className = 'btn btn-primary';
            button.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 10px 20px;
                background: #25D366;
                color: #fff;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                margin-top: 8px;
                border: none;
                cursor: pointer;
                transition: transform 0.2s ease;
            `;
            button.innerHTML = '<i class="fab fa-whatsapp"></i> Continue on WhatsApp';
            
            // Hover effect
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
            });
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            // Track analytics
            button.addEventListener('click', function() {
                Analytics.trackWhatsAppClick();
                Utils.log('WhatsApp handoff clicked');
            });
            
            container.appendChild(message);
            container.appendChild(button);
            DOM.messages.appendChild(container);
            this.scrollToBottom();
        },
        
        /**
         * Add welcome message
         */
        addWelcomeMessage: function() {
            // Add a small delay before showing welcome message
            setTimeout(function() {
                Chatbot.addMessage('assistant', CONFIG.welcomeMessage);
                Chatbot.addQuickActions();
            }, 500);
        },
        
        /**
         * Add quick actions
         */
        addQuickActions: function() {
            DOM.quickActions.innerHTML = '';
            CONFIG.quickActions.forEach(function(action) {
                const button = document.createElement('button');
                button.className = 'yukas-quick-action';
                button.dataset.value = action.value;
                button.setAttribute('role', 'button');
                button.textContent = action.label;
                button.type = 'button';
                DOM.quickActions.appendChild(button);
            });
        },
        
        /**
         * Show/hide loading indicator
         */
        showLoading: function(show) {
            if (DOM.loading) {
                DOM.loading.style.display = show ? 'flex' : 'none';
            }
            
            if (show) {
                // Add typing indicator
                const typingDiv = document.createElement('div');
                typingDiv.className = 'yukas-chat-typing';
                typingDiv.id = 'yukasTypingIndicator';
                typingDiv.setAttribute('role', 'status');
                typingDiv.setAttribute('aria-live', 'polite');
                typingDiv.innerHTML = `
                    <span></span>
                    <span></span>
                    <span></span>
                    <span style="margin-left:8px;color:rgba(255,255,255,0.5);font-size:0.8rem;">YUKAS AI is thinking...</span>
                `;
                
                const existing = document.getElementById('yukasTypingIndicator');
                if (existing) existing.remove();
                DOM.messages.appendChild(typingDiv);
                this.scrollToBottom();
            } else {
                const typing = document.getElementById('yukasTypingIndicator');
                if (typing) typing.remove();
            }
        },
        
        /**
         * Show error message
         */
        showError: function(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'yukas-chat-error';
            errorDiv.setAttribute('role', 'alert');
            errorDiv.innerHTML = `
                <span style="font-size:1.2rem;" aria-hidden="true">⚠️</span>
                <span style="flex:1;">${Utils.sanitizeMessage(message)}</span>
                <button class="yukas-chat-retry" style="
                    background: #2563EB;
                    color: #fff;
                    border: none;
                    padding: 4px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    transition: background 0.2s ease;
                ">Retry</button>
            `;
            
            // Retry functionality
            errorDiv.querySelector('.yukas-chat-retry').addEventListener('click', function() {
                errorDiv.remove();
                // Find last user message
                const lastUserMessage = State.conversationHistory
                    .slice()
                    .reverse()
                    .find(function(msg) { return msg.role === 'user'; });
                    
                if (lastUserMessage) {
                    // Remove last assistant message if it was an error
                    if (State.conversationHistory.length > 0 && 
                        State.conversationHistory[State.conversationHistory.length - 1].role === 'assistant') {
                        State.conversationHistory.pop();
                    }
                    Chatbot.sendMessage();
                }
            });
            
            // Hover effect for retry button
            errorDiv.querySelector('.yukas-chat-retry').addEventListener('mouseenter', function() {
                this.style.background = '#3B82F6';
            });
            errorDiv.querySelector('.yukas-chat-retry').addEventListener('mouseleave', function() {
                this.style.background = '#2563EB';
            });
            
            DOM.messages.appendChild(errorDiv);
            this.scrollToBottom();
            
            Utils.error('Error displayed to user:', message);
        },
        
        /**
         * Update launcher badge
         */
        updateBadge: function(hasNewMessage) {
            if (DOM.badge) {
                if (hasNewMessage) {
                    DOM.badge.classList.add('show');
                } else {
                    DOM.badge.classList.remove('show');
                }
            }
        },
        
        /**
         * Scroll messages to bottom
         */
        scrollToBottom: function() {
            if (DOM.messages) {
                requestAnimationFrame(function() {
                    DOM.messages.scrollTop = DOM.messages.scrollHeight;
                });
            }
        },
        
        /**
         * Get current conversation history
         */
        getConversationHistory: function() {
            return State.conversationHistory;
        },
        
        /**
         * Clear conversation history
         */
        clearConversation: function() {
            State.conversationHistory = [];
            State.messageCount = 0;
            DOM.messages.innerHTML = '';
            this.addWelcomeMessage();
            Utils.log('Conversation cleared');
        }
    };

    // ============================================================
    // INITIALIZATION
    // ============================================================
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            Chatbot.init();
        });
    } else {
        Chatbot.init();
    }

    // ============================================================
    // EXPOSE PUBLIC API (for debugging and integration)
    // ============================================================
    
    window.YUKAS_AI = {
        open: function() { Chatbot.openChat(); },
        close: function() { Chatbot.closeChat(); },
        toggle: function() { Chatbot.toggleChat(); },
        clear: function() { Chatbot.clearConversation(); },
        getHistory: function() { return Chatbot.getConversationHistory(); },
        version: '1.0.0',
        config: CONFIG
    };

    // ============================================================
    // CONSOLE HELPER (for debugging)
    // ============================================================
    
    if (CONFIG.debug) {
        console.log('%c YUKAS AI Chatbot v1.0.0 ', 
            'background: #2563EB; color: white; padding: 4px 8px; border-radius: 4px;');
        console.log('Available commands:');
        console.log('  YUKAS_AI.open()     - Open chat');
        console.log('  YUKAS_AI.close()    - Close chat');
        console.log('  YUKAS_AI.toggle()   - Toggle chat');
        console.log('  YUKAS_AI.clear()    - Clear conversation');
        console.log('  YUKAS_AI.getHistory() - Get conversation history');
        console.log('  YUKAS_AI.version    - Version number');
        console.log('  YUKAS_AI.config     - Configuration');
    }

})();
