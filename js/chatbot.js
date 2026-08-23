// ============================================================
// YUKAS AI CHATBOT - Frontend Module
// ============================================================

(function() {
    'use strict';

    // ========== CONFIGURATION ==========
    const CONFIG = {
        apiEndpoint: '/api/chat',
        whatsappNumber: '2347043504297',
        chatWindowId: 'yukasChatWindow',
        launcherId: 'yukasChatLauncher',
        welcomeMessage: `👋 Hello! I'm YUKAS AI, the AI assistant for YUKAS DIGITAL HUB.

    I can help you learn about our AI solutions, website development, automation, and more.

    How can I help you today?`,
        quickActions: [
            { label: '🤖 AI Solutions', value: 'Tell me about your AI solutions.' },
            { label: '🌐 Website Development', value: 'Tell me about your website development services.' },
            { label: '💬 WhatsApp Automation', value: 'Tell me about your WhatsApp automation services.' },
            { label: '🎨 Branding & Design', value: 'Tell me about your branding and design services.' },
            { label: '💼 Start a Project', value: 'I\'d like to start a project with YUKAS DIGITAL HUB.' }
        ]
    };

    // ========== STATE ==========
    let isOpen = false;
    let isProcessing = false;
    let conversationHistory = [];

    // ========== DOM REFS ==========
    let chatWindow, launcher, messagesContainer, inputField, sendButton, quickActionsContainer;

    // ========== INITIALIZATION ==========
    function init() {
        // Create HTML structure
        createChatHTML();

        // Get DOM references
        chatWindow = document.getElementById(CONFIG.chatWindowId);
        launcher = document.getElementById(CONFIG.launcherId);
        messagesContainer = document.getElementById('yukasChatMessages');
        inputField = document.getElementById('yukasChatInput');
        sendButton = document.getElementById('yukasChatSend');
        quickActionsContainer = document.getElementById('yukasQuickActions');

        // Set up event listeners
        setupEventListeners();

        // Add welcome message
        addWelcomeMessage();
    }

    // ========== CREATE HTML STRUCTURE ==========
    function createChatHTML() {
        const html = `
            <!-- Chat Launcher -->
            <div id="${CONFIG.launcherId}" 
                 class="yukas-chat-launcher" 
                 role="button" 
                 aria-label="Open YUKAS AI Chat" 
                 tabindex="0">
                <div class="yukas-launcher-icon">
                    <svg viewBox="0 0 24 24" width="28" height="28">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 1.89.54 3.64 1.48 5.14L2 22l5.14-1.48C8.36 21.46 10.11 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.65 0-3.2-.53-4.46-1.42l-.34-.24-2.38.68.73-2.31-.25-.35C4.53 15.2 4 13.65 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
                        <path fill="currentColor" d="M13 10V7h-2v3H8v2h3v3h2v-3h3v-2z"/>
                    </svg>
                </div>
                <span class="yukas-launcher-label">YUKAS AI</span>
                <span class="yukas-launcher-badge">●</span>
            </div>

            <!-- Chat Window -->
            <div id="${CONFIG.chatWindowId}" 
                 class="yukas-chat-window" 
                 role="dialog" 
                 aria-label="YUKAS AI Chat" 
                 aria-hidden="true"
                 style="display: none;">
                
                <!-- Header -->
                <div class="yukas-chat-header">
                    <div class="yukas-chat-header-left">
                        <div class="yukas-chat-avatar">AI</div>
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

                <!-- Messages -->
                <div class="yukas-chat-messages" id="yukasChatMessages"></div>

                <!-- Quick Actions -->
                <div class="yukas-quick-actions" id="yukasQuickActions"></div>

                <!-- Footer -->
                <div class="yukas-chat-footer">
                    <textarea class="yukas-chat-input" 
                              id="yukasChatInput" 
                              rows="1" 
                              placeholder="Ask me anything about YUKAS DIGITAL HUB..."
                              aria-label="Type your message"
                              maxlength="500"></textarea>
                    <button class="yukas-chat-send" 
                            id="yukasChatSend" 
                            aria-label="Send message" 
                            disabled>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>

                <!-- Loading Indicator -->
                <div class="yukas-chat-loading" id="yukasChatLoading" style="display: none;">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        // Only add if it doesn't already exist
        if (!document.getElementById(CONFIG.launcherId)) {
            document.body.insertAdjacentHTML('beforeend', html);
        }
    }

    // ========== SETUP EVENT LISTENERS ==========
    function setupEventListeners() {
        // Launcher click
        launcher.addEventListener('click', toggleChat);
        launcher.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleChat();
            }
        });

        // Close button
        document.querySelector('.yukas-chat-close').addEventListener('click', closeChat);

        // Send button
        sendButton.addEventListener('click', sendMessage);

        // Input field
        inputField.addEventListener('input', handleInputChange);
        inputField.addEventListener('keydown', handleKeyDown);

        // Click outside to close
        document.addEventListener('click', handleOutsideClick);

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeChat();
            }
        });

        // Quick actions
        quickActionsContainer.addEventListener('click', handleQuickAction);
    }

    // ========== TOGGLE CHAT ==========
    function toggleChat() {
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    }

    // ========== OPEN CHAT ==========
    function openChat() {
        isOpen = true;
        chatWindow.style.display = 'flex';
        chatWindow.setAttribute('aria-hidden', 'false');
        launcher.classList.add('active');

        // Focus input after animation
        setTimeout(() => {
            inputField.focus();
        }, 300);

        // Auto-scroll to bottom
        scrollToBottom();

        // Update badge
        updateBadge(false);
    }

    // ========== CLOSE CHAT ==========
    function closeChat() {
        isOpen = false;
        chatWindow.style.display = 'none';
        chatWindow.setAttribute('aria-hidden', 'true');
        launcher.classList.remove('active');
    }

    // ========== HANDLE OUTSIDE CLICK ==========
    function handleOutsideClick(e) {
        if (isOpen) {
            const chatElement = document.getElementById(CONFIG.chatWindowId);
            const launcherElement = document.getElementById(CONFIG.launcherId);
            
            if (chatElement && !chatElement.contains(e.target) && 
                launcherElement && !launcherElement.contains(e.target)) {
                closeChat();
            }
        }
    }

    // ========== HANDLE INPUT CHANGE ==========
    function handleInputChange() {
        const value = inputField.value.trim();
        sendButton.disabled = value.length === 0 || isProcessing;
        
        // Auto-resize textarea
        inputField.style.height = 'auto';
        inputField.style.height = Math.min(inputField.scrollHeight, 80) + 'px';
    }

    // ========== HANDLE KEYDOWN ==========
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendButton.disabled) {
                sendMessage();
            }
        }
        if (e.key === 'Enter' && e.shiftKey) {
            // Allow newline
            e.preventDefault();
            inputField.value += '\n';
            handleInputChange();
        }
    }

    // ========== HANDLE QUICK ACTION ==========
    function handleQuickAction(e) {
        const action = e.target.closest('.yukas-quick-action');
        if (!action) return;
        
        const value = action.dataset.value;
        if (value) {
            inputField.value = value;
            handleInputChange();
            sendMessage();
        }
    }

    // ========== SEND MESSAGE ==========
    function sendMessage() {
        const message = inputField.value.trim();
        if (!message || isProcessing) return;

        // Add user message to chat
        addMessage('user', message);
        conversationHistory.push({ role: 'user', content: message });

        // Clear input
        inputField.value = '';
        handleInputChange();

        // Show loading
        showLoading(true);

        // Send to API
        isProcessing = true;
        sendButton.disabled = true;

        fetch(CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || 'Server error');
                });
            }
            return response.json();
        })
        .then(data => {
            const aiMessage = data.message;
            conversationHistory.push({ role: 'assistant', content: aiMessage });
            addMessage('assistant', aiMessage);
        })
        .catch(error => {
            console.error('Chat error:', error);
            showError(error.message || 'Something went wrong. Please try again.');
        })
        .finally(() => {
            showLoading(false);
            isProcessing = false;
            sendButton.disabled = inputField.value.trim().length === 0;
            scrollToBottom();
        });
    }

    // ========== ADD MESSAGE ==========
    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `yukas-chat-message yukas-chat-message-${role}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'yukas-chat-avatar';
        avatar.textContent = role === 'user' ? 'You' : 'AI';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'yukas-chat-message-content';
        
        // Convert newlines to <br> for display
        const formattedContent = content.replace(/\n/g, '<br>');
        contentDiv.innerHTML = formattedContent;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);
        
        // Check if message contains WhatsApp handoff suggestion
        if (role === 'assistant' && content.toLowerCase().includes('whatsapp')) {
            addWhatsAppButton();
        }
        
        scrollToBottom();
    }

    // ========== ADD WHATSAPP HANDOFF BUTTON ==========
    function addWhatsAppButton() {
        // Remove existing WhatsApp button to avoid duplicates
        const existingButton = messagesContainer.querySelector('.yukas-whatsapp-handoff');
        if (existingButton) existingButton.remove();
        
        const container = document.createElement('div');
        container.className = 'yukas-whatsapp-handoff';
        
        const message = document.createElement('p');
        message.textContent = '💬 Want to continue this conversation on WhatsApp?';
        
        const button = document.createElement('a');
        button.href = `https://wa.me/${CONFIG.whatsappNumber}?text=Hi%20YUKAS%20DIGITAL%20HUB%2C%20I'm%20interested%20in%20learning%20more%20about%20your%20services!`;
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
        `;
        button.innerHTML = '<i class="fab fa-whatsapp"></i> Continue on WhatsApp';
        
        container.appendChild(message);
        container.appendChild(button);
        messagesContainer.appendChild(container);
        scrollToBottom();
    }

    // ========== ADD WELCOME MESSAGE ==========
    function addWelcomeMessage() {
        addMessage('assistant', CONFIG.welcomeMessage);
        addQuickActions();
    }

    // ========== ADD QUICK ACTIONS ==========
    function addQuickActions() {
        quickActionsContainer.innerHTML = '';
        CONFIG.quickActions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'yukas-quick-action';
            button.dataset.value = action.value;
            button.textContent = action.label;
            button.type = 'button';
            quickActionsContainer.appendChild(button);
        });
    }

    // ========== SHOW LOADING ==========
    function showLoading(show) {
        const loadingEl = document.getElementById('yukasChatLoading');
        if (loadingEl) {
            loadingEl.style.display = show ? 'flex' : 'none';
        }
        if (show) {
            // Add a temporary message for loading state
            const typingDiv = document.createElement('div');
            typingDiv.className = 'yukas-chat-typing';
            typingDiv.id = 'yukasTypingIndicator';
            typingDiv.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
                <span style="margin-left:8px;color:rgba(255,255,255,0.5);font-size:0.8rem;">YUKAS AI is thinking...</span>
            `;
            // Remove existing typing indicator if any
            const existing = document.getElementById('yukasTypingIndicator');
            if (existing) existing.remove();
            messagesContainer.appendChild(typingDiv);
            scrollToBottom();
        } else {
            const typing = document.getElementById('yukasTypingIndicator');
            if (typing) typing.remove();
        }
    }

    // ========== SHOW ERROR ==========
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'yukas-chat-error';
        errorDiv.innerHTML = `
            <span style="font-size:1.2rem;">⚠️</span>
            <span style="flex:1;">${message}</span>
            <button class="yukas-chat-retry" style="
                background: #2563EB;
                color: #fff;
                border: none;
                padding: 4px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.8rem;
            ">Retry</button>
        `;
        
        // Add retry functionality
        errorDiv.querySelector('.yukas-chat-retry').addEventListener('click', () => {
            errorDiv.remove();
            // Resend the last user message
            const lastUserMessage = conversationHistory.findLast(msg => msg.role === 'user');
            if (lastUserMessage) {
                // Remove the last assistant message if it was an error
                if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === 'assistant') {
                    conversationHistory.pop();
                }
                sendMessage();
            }
        });
        
        messagesContainer.appendChild(errorDiv);
        scrollToBottom();
    }

    // ========== UPDATE BADGE ==========
    function updateBadge(hasNewMessage) {
        const badge = document.querySelector('.yukas-launcher-badge');
        if (badge) {
            badge.style.display = hasNewMessage ? 'block' : 'none';
        }
    }

    // ========== SCROLL TO BOTTOM ==========
    function scrollToBottom() {
        if (messagesContainer) {
            requestAnimationFrame(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            });
        }
    }

    // ========== HANDLE CONSOLE LOGS (for debugging) ==========
    console.log('YUKAS AI Chatbot initialized.');
    console.log('WhatsApp Number:', CONFIG.whatsappNumber);

    // ========== INITIALIZE ON DOM READY ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
