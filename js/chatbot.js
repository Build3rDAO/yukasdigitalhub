/**
 * ============================================================
 * YUKAS AI CHATBOT - Production Ready Frontend
 * ============================================================
 *
 * YUKAS DIGITAL HUB
 *
 * Features:
 * - Gemini-compatible /api/chat communication
 * - English + Hausa conversation support
 * - Correct message/history API contract
 * - Conversation history management
 * - WhatsApp human handoff
 * - Quick action buttons
 * - Responsive chat interface
 * - Accessibility support
 * - Error handling + retry
 * - Request timeout protection
 * - Duplicate initialization protection
 * - XSS-safe message rendering
 * - Session tracking
 * - Rate-limit protection
 *
 * IMPORTANT API CONTRACT
 *
 * Frontend sends:
 *
 * {
 *   message: "user message",
 *   history: [
 *     { role: "user", content: "..." },
 *     { role: "assistant", content: "..." }
 *   ]
 * }
 *
 * Backend returns:
 *
 * {
 *   message: "AI response"
 * }
 *
 * ============================================================
 * Version: 2.0.0
 * Author: YUKAS DIGITAL HUB
 * ============================================================
 */

(function () {
    "use strict";

    // ============================================================
    // PREVENT DUPLICATE INITIALIZATION
    // ============================================================

    if (window.YUKAS_AI && window.YUKAS_AI.__initialized) {
        console.warn("[YUKAS AI] Chatbot already initialized.");
        return;
    }

    // ============================================================
    // CONFIGURATION
    // ============================================================

    const CONFIG = {

        // --------------------------------------------------------
        // API
        // --------------------------------------------------------

        apiEndpoint: "/api/chat",

        requestTimeout: 30000,

        // --------------------------------------------------------
        // WhatsApp
        // --------------------------------------------------------

        whatsappNumber: "2347043504297",

        whatsappMessage:
            "Hi YUKAS DIGITAL HUB, I'm interested in learning more about your services.",

        // --------------------------------------------------------
        // DOM IDs
        // --------------------------------------------------------

        chatWindowId: "yukasChatWindow",

        launcherId: "yukasChatLauncher",

        messagesId: "yukasChatMessages",

        inputId: "yukasChatInput",

        sendButtonId: "yukasChatSend",

        quickActionsId: "yukasQuickActions",

        loadingId: "yukasChatLoading",

        // --------------------------------------------------------
        // Limits
        // --------------------------------------------------------

        maxMessageLength: 500,

        maxHistoryLength: 10,

        maxHistoryMessageLength: 500,

        // --------------------------------------------------------
        // UI
        // --------------------------------------------------------

        welcomeMessage:
            "👋 Hello! I'm YUKAS AI, the AI assistant for YUKAS DIGITAL HUB.\n\n" +
            "I can help you learn about our AI solutions, website development, " +
            "automation, branding, UI/UX, and other digital services.\n\n" +
            "How can I help you today?",

        quickActions: [
            {
                label: "🤖 AI Solutions",
                value: "Tell me about your AI solutions."
            },
            {
                label: "🌐 Website Development",
                value: "Tell me about your website development services."
            },
            {
                label: "💬 WhatsApp Automation",
                value: "Tell me about your WhatsApp automation services."
            },
            {
                label: "🎨 Branding & Design",
                value: "Tell me about your branding and design services."
            },
            {
                label: "💼 Start a Project",
                value: "I'd like to start a project with YUKAS DIGITAL HUB."
            }
        ],

        // --------------------------------------------------------
        // Rate limiting
        // --------------------------------------------------------

        minimumMessageInterval: 800,

        // --------------------------------------------------------
        // Debug
        // --------------------------------------------------------

        debug: false
    };

    // ============================================================
    // STATE
    // ============================================================

    const State = {

        isOpen: false,

        isProcessing: false,

        conversationHistory: [],

        sessionId: null,

        messageCount: 0,

        lastMessageTime: 0,

        lastFailedMessage: null,

        initialized: false
    };

    // ============================================================
    // DOM
    // ============================================================

    let DOM = {};

    // ============================================================
    // UTILITY FUNCTIONS
    // ============================================================

    const Utils = {

        // --------------------------------------------------------
        // Logging
        // --------------------------------------------------------

        log: function (message, data) {

            if (CONFIG.debug) {
                console.log(
                    "[YUKAS AI] " + message,
                    data !== undefined ? data : ""
                );
            }
        },

        error: function (message, error) {

            console.error(
                "[YUKAS AI ERROR] " + message,
                error || ""
            );
        },

        // --------------------------------------------------------
        // Session ID
        // --------------------------------------------------------

        generateSessionId: function () {

            if (
                window.crypto &&
                typeof window.crypto.randomUUID === "function"
            ) {
                return "yukas-" + window.crypto.randomUUID();
            }

            return (
                "yukas-" +
                Date.now() +
                "-" +
                Math.random().toString(36).substring(2, 11)
            );
        },

        // --------------------------------------------------------
        // Timestamp
        // --------------------------------------------------------

        getTimestamp: function () {

            return new Date().toISOString();
        },

        // --------------------------------------------------------
        // Sanitize plain text
        // --------------------------------------------------------

        sanitizeText: function (text, maxLength) {

            if (typeof text !== "string") {
                return "";
            }

            let value = text
                .replace(/\u0000/g, "")
                .trim();

            if (typeof maxLength === "number") {
                value = value.slice(0, maxLength);
            }

            return value;
        },

        // --------------------------------------------------------
        // HTML escaping
        // --------------------------------------------------------

        escapeHTML: function (text) {

            const div = document.createElement("div");

            div.textContent = text;

            return div.innerHTML;
        },

        // --------------------------------------------------------
        // Empty check
        // --------------------------------------------------------

        isEmpty: function (text) {

            return !text || text.trim().length === 0;
        },

        // --------------------------------------------------------
        // Debounce
        // --------------------------------------------------------

        debounce: function (func, wait) {

            let timeout;

            return function () {

                const context = this;

                const args = arguments;

                clearTimeout(timeout);

                timeout = setTimeout(function () {

                    func.apply(context, args);

                }, wait);
            };
        },

        // --------------------------------------------------------
        // Detect mobile device
        // --------------------------------------------------------

        isMobile: function () {

            return window.innerWidth <= 768;
        },

        // --------------------------------------------------------
        // Build WhatsApp URL
        // --------------------------------------------------------

        getWhatsAppUrl: function (message) {

            return (
                "https://wa.me/" +
                CONFIG.whatsappNumber +
                "?text=" +
                encodeURIComponent(message)
            );
        }
    };

    // ============================================================
    // HISTORY MANAGEMENT
    // ============================================================

    const History = {

        // --------------------------------------------------------
        // Add message
        // --------------------------------------------------------

        add: function (role, content) {

            if (
                role !== "user" &&
                role !== "assistant"
            ) {
                return;
            }

            const cleanContent = Utils.sanitizeText(
                content,
                CONFIG.maxHistoryMessageLength
            );

            if (!cleanContent) {
                return;
            }

            State.conversationHistory.push({
                role: role,
                content: cleanContent
            });

            this.trim();
        },

        // --------------------------------------------------------
        // Trim history
        // --------------------------------------------------------

        trim: function () {

            const maxItems =
                CONFIG.maxHistoryLength * 2;

            if (
                State.conversationHistory.length >
                maxItems
            ) {

                State.conversationHistory =
                    State.conversationHistory.slice(-maxItems);
            }
        },

        // --------------------------------------------------------
        // Get history
        // --------------------------------------------------------

        get: function () {

            return State.conversationHistory.map(function (message) {

                return {
                    role: message.role,
                    content: message.content
                };
            });
        },

        // --------------------------------------------------------
        // Clear history
        // --------------------------------------------------------

        clear: function () {

            State.conversationHistory = [];

            State.messageCount = 0;

            State.lastFailedMessage = null;
        }
    };

    // ============================================================
    // CHATBOT
    // ============================================================

    const Chatbot = {

        // ========================================================
        // INITIALIZATION
        // ========================================================

        init: function () {

            if (State.initialized) {
                return;
            }

            Utils.log("Initializing YUKAS AI...");

            State.sessionId =
                Utils.generateSessionId();

            this.createHTML();

            this.getDOMReferences();

            if (!this.validateDOM()) {
                Utils.error(
                    "Chatbot initialization failed because required DOM elements are missing."
                );

                return;
            }

            this.setupEventListeners();

            this.addWelcomeMessage();

            this.addQuickActions();

            State.initialized = true;

            Utils.log(
                "YUKAS AI initialized successfully."
            );
        },

        // ========================================================
        // CREATE HTML
        // ========================================================

        createHTML: function () {

            if (
                document.getElementById(
                    CONFIG.launcherId
                )
            ) {
                return;
            }

            const html = `
                <!-- ==================================================
                     YUKAS AI LAUNCHER
                =================================================== -->

                <div
                    id="${CONFIG.launcherId}"
                    class="yukas-chat-launcher"
                    role="button"
                    aria-label="Open YUKAS AI Chat"
                    aria-controls="${CONFIG.chatWindowId}"
                    aria-expanded="false"
                    tabindex="0"
                    title="Chat with YUKAS AI"
                >

                    <div
                        class="yukas-launcher-icon"
                        aria-hidden="true"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width="28"
                            height="28"
                        >
                            <path
                                fill="currentColor"
                                d="M12 2C6.48 2 2 6.48 2 12c0 1.89.54 3.64 1.48 5.14L2 22l5.14-1.48C8.36 21.46 10.11 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.65 0-3.2-.53-4.46-1.42l-.34-.24-2.38.68.73-2.31-.25-.35C4.53 15.2 4 13.65 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"
                            />

                            <path
                                fill="currentColor"
                                d="M13 10V7h-2v3H8v2h3v3h2v-3h3v-2z"
                            />
                        </svg>
                    </div>

                    <span class="yukas-launcher-label">
                        YUKAS AI
                    </span>

                    <span
                        class="yukas-launcher-badge"
                        aria-hidden="true"
                    >
                        ●
                    </span>

                </div>

                <!-- ==================================================
                     YUKAS AI CHAT WINDOW
                =================================================== -->

                <div
                    id="${CONFIG.chatWindowId}"
                    class="yukas-chat-window"
                    role="dialog"
                    aria-modal="false"
                    aria-label="YUKAS AI Chat"
                    aria-hidden="true"
                    style="display:none;"
                >

                    <!-- Header -->

                    <div class="yukas-chat-header">

                        <div class="yukas-chat-header-left">

                            <div
                                class="yukas-chat-avatar"
                                aria-hidden="true"
                            >
                                AI
                            </div>

                            <div class="yukas-chat-header-info">

                                <span class="yukas-chat-header-title">
                                    YUKAS AI
                                </span>

                                <span class="yukas-chat-header-status">
                                    ● Online
                                </span>

                            </div>

                        </div>

                        <button
                            type="button"
                            class="yukas-chat-close"
                            aria-label="Close chat"
                            title="Close chat"
                        >
                            ✕
                        </button>

                    </div>

                    <!-- Messages -->

                    <div
                        class="yukas-chat-messages"
                        id="${CONFIG.messagesId}"
                        role="log"
                        aria-live="polite"
                        aria-relevant="additions"
                    ></div>

                    <!-- Quick Actions -->

                    <div
                        class="yukas-quick-actions"
                        id="${CONFIG.quickActionsId}"
                        role="toolbar"
                        aria-label="Quick actions"
                    ></div>

                    <!-- Loading -->

                    <div
                        class="yukas-chat-loading"
                        id="${CONFIG.loadingId}"
                        style="display:none;"
                        role="status"
                        aria-live="polite"
                    >

                        <span></span>
                        <span></span>
                        <span></span>

                        <span
                            style="
                                margin-left:8px;
                                color:rgba(255,255,255,0.5);
                                font-size:0.8rem;
                            "
                        >
                            YUKAS AI is thinking...
                        </span>

                    </div>

                    <!-- Footer -->

                    <div class="yukas-chat-footer">

                        <textarea
                            class="yukas-chat-input"
                            id="${CONFIG.inputId}"
                            rows="1"
                            placeholder="Ask me about YUKAS DIGITAL HUB..."
                            aria-label="Type your message"
                            maxlength="${CONFIG.maxMessageLength}"
                            autocomplete="off"
                            spellcheck="true"
                        ></textarea>

                        <button
                            type="button"
                            class="yukas-chat-send"
                            id="${CONFIG.sendButtonId}"
                            aria-label="Send message"
                            title="Send message"
                            disabled
                        >

                            <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                aria-hidden="true"
                            >
                                <path
                                    fill="currentColor"
                                    d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                                />
                            </svg>

                        </button>

                    </div>

                </div>
            `;

            document.body.insertAdjacentHTML(
                "beforeend",
                html
            );
        },

        // ========================================================
        // DOM REFERENCES
        // ========================================================

        getDOMReferences: function () {

            DOM = {

                chatWindow:
                    document.getElementById(
                        CONFIG.chatWindowId
                    ),

                launcher:
                    document.getElementById(
                        CONFIG.launcherId
                    ),

                messages:
                    document.getElementById(
                        CONFIG.messagesId
                    ),

                input:
                    document.getElementById(
                        CONFIG.inputId
                    ),

                sendButton:
                    document.getElementById(
                        CONFIG.sendButtonId
                    ),

                quickActions:
                    document.getElementById(
                        CONFIG.quickActionsId
                    ),

                loading:
                    document.getElementById(
                        CONFIG.loadingId
                    ),

                closeButton:
                    document.querySelector(
                        ".yukas-chat-close"
                    ),

                badge:
                    document.querySelector(
                        ".yukas-launcher-badge"
                    )
            };
        },

        // ========================================================
        // VALIDATE DOM
        // ========================================================

        validateDOM: function () {

            const required = [
                "chatWindow",
                "launcher",
                "messages",
                "input",
                "sendButton",
                "quickActions",
                "loading",
                "closeButton"
            ];

            const missing =
                required.filter(function (key) {
                    return !DOM[key];
                });

            if (missing.length > 0) {

                Utils.error(
                    "Missing DOM elements:",
                    missing
                );

                return false;
            }

            return true;
        },

        // ========================================================
        // EVENT LISTENERS
        // ========================================================

        setupEventListeners: function () {

            // Launcher

            DOM.launcher.addEventListener(
                "click",
                this.toggleChat.bind(this)
            );

            DOM.launcher.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        Chatbot.toggleChat();
                    }
                }
            );

            // Close

            DOM.closeButton.addEventListener(
                "click",
                this.closeChat.bind(this)
            );

            // Send

            DOM.sendButton.addEventListener(
                "click",
                this.sendMessage.bind(this)
            );

            // Input

            DOM.input.addEventListener(
                "input",
                this.handleInputChange.bind(this)
            );

            DOM.input.addEventListener(
                "keydown",
                this.handleKeyDown.bind(this)
            );

            // Quick actions

            DOM.quickActions.addEventListener(
                "click",
                this.handleQuickAction.bind(this)
            );

            // Outside click

            document.addEventListener(
                "click",
                this.handleOutsideClick.bind(this)
            );

            // Escape

            document.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Escape" &&
                        State.isOpen
                    ) {
                        Chatbot.closeChat();
                    }
                }
            );

            // Resize

            const resizeHandler =
                Utils.debounce(
                    this.handleResize.bind(this),
                    250
                );

            window.addEventListener(
                "resize",
                resizeHandler
            );
        },

        // ========================================================
        // OPEN CHAT
        // ========================================================

        openChat: function () {

            State.isOpen = true;

            DOM.chatWindow.style.display = "flex";

            DOM.chatWindow.setAttribute(
                "aria-hidden",
                "false"
            );

            DOM.launcher.classList.add(
                "active"
            );

            DOM.launcher.setAttribute(
                "aria-expanded",
                "true"
            );

            this.updateBadge(false);

            setTimeout(function () {

                if (DOM.input) {
                    DOM.input.focus();
                }

            }, 200);

            this.scrollToBottom();
        },

        // ========================================================
        // CLOSE CHAT
        // ========================================================

        closeChat: function () {

            State.isOpen = false;

            DOM.chatWindow.style.display = "none";

            DOM.chatWindow.setAttribute(
                "aria-hidden",
                "true"
            );

            DOM.launcher.classList.remove(
                "active"
            );

            DOM.launcher.setAttribute(
                "aria-expanded",
                "false"
            );
        },

        // ========================================================
        // TOGGLE
        // ========================================================

        toggleChat: function () {

            if (State.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        },

        // ========================================================
        // OUTSIDE CLICK
        // ========================================================

        handleOutsideClick: function (event) {

            if (!State.isOpen) {
                return;
            }

            if (
                DOM.chatWindow &&
                DOM.launcher &&
                !DOM.chatWindow.contains(event.target) &&
                !DOM.launcher.contains(event.target)
            ) {
                this.closeChat();
            }
        },

        // ========================================================
        // RESIZE
        // ========================================================

        handleResize: function () {

            this.scrollToBottom();
        },

        // ========================================================
        // INPUT CHANGE
        // ========================================================

        handleInputChange: function () {

            const value =
                DOM.input.value.trim();

            DOM.sendButton.disabled =
                value.length === 0 ||
                State.isProcessing;

            // Auto resize

            DOM.input.style.height =
                "auto";

            DOM.input.style.height =
                Math.min(
                    DOM.input.scrollHeight,
                    100
                ) + "px";
        },

        // ========================================================
        // KEYBOARD
        // ========================================================

        handleKeyDown: function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                if (
                    !DOM.sendButton.disabled
                ) {
                    this.sendMessage();
                }

                return;
            }

            if (
                event.key === "Enter" &&
                event.shiftKey
            ) {

                // Allow normal newline behavior.

                return;
            }
        },

        // ========================================================
        // QUICK ACTION
        // ========================================================

        handleQuickAction: function (event) {

            const button =
                event.target.closest(
                    ".yukas-quick-action"
                );

            if (!button) {
                return;
            }

            const value =
                button.dataset.value;

            if (!value || State.isProcessing) {
                return;
            }

            DOM.input.value = value;

            this.handleInputChange();

            this.sendMessage();
        },

        // ========================================================
        // SEND MESSAGE
        // ========================================================

        sendMessage: async function () {

            if (State.isProcessing) {
                return;
            }

            const rawMessage =
                DOM.input.value;

            const message =
                Utils.sanitizeText(
                    rawMessage,
                    CONFIG.maxMessageLength
                );

            // ----------------------------------------------------
            // VALIDATION
            // ----------------------------------------------------

            if (Utils.isEmpty(message)) {
                return;
            }

            if (
                message.length >
                CONFIG.maxMessageLength
            ) {

                this.showError(
                    "Your message is too long. Please keep it under " +
                    CONFIG.maxMessageLength +
                    " characters."
                );

                return;
            }

            // ----------------------------------------------------
            // CLIENT RATE LIMIT
            // ----------------------------------------------------

            const now = Date.now();

            if (
                State.lastMessageTime &&
                now - State.lastMessageTime <
                CONFIG.minimumMessageInterval
            ) {

                this.showError(
                    "Please wait a moment before sending another message."
                );

                return;
            }

            State.lastMessageTime = now;

            // ----------------------------------------------------
            // SAVE FAILED MESSAGE FOR RETRY
            // ----------------------------------------------------

            State.lastFailedMessage = message;

            // ----------------------------------------------------
            // DISPLAY USER MESSAGE
            // ----------------------------------------------------

            this.addMessage(
                "user",
                message
            );

            // ----------------------------------------------------
            // ADD TO HISTORY
            // ----------------------------------------------------

            History.add(
                "user",
                message
            );

            // ----------------------------------------------------
            // CLEAR INPUT
            // ----------------------------------------------------

            DOM.input.value = "";

            this.handleInputChange();

            // ----------------------------------------------------
            // STATE
            // ----------------------------------------------------

            State.messageCount++;

            State.isProcessing = true;

            DOM.sendButton.disabled = true;

            this.showLoading(true);

            // ----------------------------------------------------
            // API REQUEST
            // ----------------------------------------------------

            try {

                const data =
                    await this.requestAI(
                        message
                    );

                // ------------------------------------------------
                // VALIDATE RESPONSE
                // ------------------------------------------------

                if (
                    !data ||
                    typeof data.message !== "string" ||
                    !data.message.trim()
                ) {

                    throw new Error(
                        "The AI returned an empty response."
                    );
                }

                const aiMessage =
                    data.message.trim();

                // ------------------------------------------------
                // ADD ASSISTANT HISTORY
                // ------------------------------------------------

                History.add(
                    "assistant",
                    aiMessage
                );

                // ------------------------------------------------
                // DISPLAY AI RESPONSE
                // ------------------------------------------------

                this.addMessage(
                    "assistant",
                    aiMessage
                );

                // ------------------------------------------------
                // CLEAR FAILED MESSAGE
                // ------------------------------------------------

                State.lastFailedMessage = null;

                // ------------------------------------------------
                // OPTIONAL BADGE
                // ------------------------------------------------

                if (!State.isOpen) {
                    this.updateBadge(true);
                }

            } catch (error) {

                Utils.error(
                    "Chat request failed:",
                    error
                );

                // -----------------------------------------------
                // Remove user message from history because
                // the AI did not successfully process it.
                // -----------------------------------------------

                if (
                    State.conversationHistory.length > 0
                ) {

                    const last =
                        State.conversationHistory[
                            State.conversationHistory.length - 1
                        ];

                    if (
                        last.role === "user" &&
                        last.content === message
                    ) {

                        State.conversationHistory.pop();
                    }
                }

                this.showError(
                    this.getFriendlyErrorMessage(error)
                );

            } finally {

                this.showLoading(false);

                State.isProcessing = false;

                this.handleInputChange();

                this.scrollToBottom();
            }
        },

        // ========================================================
        // API REQUEST
        // ========================================================

        requestAI: async function (message) {

            const controller =
                new AbortController();

            const timeout =
                setTimeout(function () {

                    controller.abort();

                }, CONFIG.requestTimeout);

            try {

                /*
                 * IMPORTANT:
                 *
                 * This is the corrected API contract.
                 *
                 * Backend expects:
                 *
                 * {
                 *   message: "...",
                 *   history: [...]
                 * }
                 */

                const payload = {

                    message: message,

                    history: History.get()
                };

                Utils.log(
                    "Sending API request:",
                    payload
                );

                const response =
                    await fetch(
                        CONFIG.apiEndpoint,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    payload
                                ),

                            signal:
                                controller.signal
                        }
                    );

                // ------------------------------------------------
                // RESPONSE CONTENT TYPE
                // ------------------------------------------------

                const contentType =
                    response.headers.get(
                        "content-type"
                    ) || "";

                let data;

                if (
                    contentType.includes(
                        "application/json"
                    )
                ) {

                    data =
                        await response.json();

                } else {

                    const text =
                        await response.text();

                    throw new Error(
                        text ||
                        "Server returned an invalid response."
                    );
                }

                Utils.log(
                    "API response:",
                    data
                );

                // ------------------------------------------------
                // HTTP ERROR
                // ------------------------------------------------

                if (!response.ok) {

                    const error =
                        new Error(
                            data.error ||
                            data.message ||
                            "Unable to process your request."
                        );

                    error.status =
                        response.status;

                    error.data =
                        data;

                    throw error;
                }

                return data;

            } finally {

                clearTimeout(timeout);
            }
        },

        // ========================================================
        // FRIENDLY ERROR
        // ========================================================

        getFriendlyErrorMessage: function (
            error
        ) {

            if (!error) {

                return (
                    "Something went wrong. " +
                    "Please try again."
                );
            }

            if (
                error.name ===
                "AbortError"
            ) {

                return (
                    "The AI took too long to respond. " +
                    "Please try again."
                );
            }

            if (
                error.status === 429
            ) {

                return (
                    "Too many requests right now. " +
                    "Please wait a moment and try again."
                );
            }

            if (
                error.status === 400
            ) {

                return (
                    error.message ||
                    "Please check your message and try again."
                );
            }

            if (
                error.status === 500 ||
                error.status === 503
            ) {

                return (
                    "YUKAS AI is temporarily unavailable. " +
                    "Please try again in a moment."
                );
            }

            if (
                error.message &&
                (
                    error.message
                        .toLowerCase()
                        .includes("failed to fetch") ||

                    error.message
                        .toLowerCase()
                        .includes("network")
                )
            ) {

                return (
                    "I couldn't connect to YUKAS AI. " +
                    "Please check your internet connection and try again."
                );
            }

            return (
                error.message ||
                "Something went wrong. Please try again."
            );
        },

        // ========================================================
        // RETRY FAILED MESSAGE
        // ========================================================

        retryLastMessage: async function () {

            if (
                !State.lastFailedMessage ||
                State.isProcessing
            ) {
                return;
            }

            const message =
                State.lastFailedMessage;

            // Remove old error messages.

            const errors =
                DOM.messages.querySelectorAll(
                    ".yukas-chat-error"
                );

            errors.forEach(function (error) {
                error.remove();
            });

            // Put message back into input.

            DOM.input.value = message;

            this.handleInputChange();

            // Send normally.

            await this.sendMessage();
        },

        // ========================================================
        // ADD MESSAGE
        // ========================================================

        addMessage: function (
            role,
            content
        ) {

            if (
                !content ||
                !DOM.messages
            ) {
                return;
            }

            const messageDiv =
                document.createElement("div");

            messageDiv.className =
                "yukas-chat-message " +
                "yukas-chat-message-" +
                role;

            const avatar =
                document.createElement("div");

            avatar.className =
                "yukas-chat-avatar";

            avatar.textContent =
                role === "user"
                    ? "You"
                    : "AI";

            const contentDiv =
                document.createElement("div");

            contentDiv.className =
                "yukas-chat-message-content";

            /*
             * IMPORTANT SECURITY FIX:
             *
             * Do NOT insert AI/user text directly into
             * innerHTML.
             *
             * textContent prevents XSS.
             */

            contentDiv.textContent =
                Utils.sanitizeText(
                    content,
                    CONFIG.maxMessageLength
                );

            /*
             * Preserve line breaks safely.
             */

            contentDiv.style.whiteSpace =
                "pre-wrap";

            messageDiv.appendChild(
                avatar
            );

            messageDiv.appendChild(
                contentDiv
            );

            DOM.messages.appendChild(
                messageDiv
            );

            // ----------------------------------------------------
            // WHATSAPP HANDOFF
            // ----------------------------------------------------

            if (
                role === "assistant" &&
                this.shouldShowWhatsApp(content)
            ) {

                this.addWhatsAppButton();
            }

            this.scrollToBottom();
        },

        // ========================================================
        // WHATSAPP DETECTION
        // ========================================================

        shouldShowWhatsApp: function (
            content
        ) {

            const lower =
                content.toLowerCase();

            const indicators = [
                "whatsapp",
                "0704 350 4297",
                "+234 704 350 4297",
                "continue on whatsapp",
                "contact our team",
                "speak with our team",
                "talk to our team",
                "get a quotation",
                "get a quote",
                "project consultation",
                "contact us"
            ];

            return indicators.some(
                function (word) {
                    return lower.includes(word);
                }
            );
        },

        // ========================================================
        // WHATSAPP BUTTON
        // ========================================================

        addWhatsAppButton: function () {

            // Remove previous handoff.

            const existing =
                DOM.messages.querySelector(
                    ".yukas-whatsapp-handoff"
                );

            if (existing) {
                existing.remove();
            }

            const container =
                document.createElement("div");

            container.className =
                "yukas-whatsapp-handoff";

            const message =
                document.createElement("p");

            message.textContent =
                "💬 Want to continue with our team on WhatsApp?";

            const button =
                document.createElement("a");

            button.href =
                Utils.getWhatsAppUrl(
                    CONFIG.whatsappMessage
                );

            button.target =
                "_blank";

            button.rel =
                "noopener noreferrer";

            button.className =
                "yukas-whatsapp-button";

            button.setAttribute(
                "aria-label",
                "Continue conversation on WhatsApp"
            );

            button.textContent =
                "💬 Continue on WhatsApp";

            button.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 10px 18px;
                background: #25D366;
                color: #ffffff;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                margin-top: 8px;
                border: none;
                cursor: pointer;
                transition: transform 0.2s ease;
            `;

            button.addEventListener(
                "mouseenter",
                function () {

                    this.style.transform =
                        "scale(1.02)";
                }
            );

            button.addEventListener(
                "mouseleave",
                function () {

                    this.style.transform =
                        "scale(1)";
                }
            );

            container.appendChild(
                message
            );

            container.appendChild(
                button
            );

            DOM.messages.appendChild(
                container
            );

            this.scrollToBottom();
        },

        // ========================================================
        // WELCOME
        // ========================================================

        addWelcomeMessage: function () {

            DOM.messages.innerHTML = "";

            this.addMessage(
                "assistant",
                CONFIG.welcomeMessage
            );
        },

        // ========================================================
        // QUICK ACTIONS
        // ========================================================

        addQuickActions: function () {

            DOM.quickActions.innerHTML = "";

            CONFIG.quickActions.forEach(
                function (action) {

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.type =
                        "button";

                    button.className =
                        "yukas-quick-action";

                    button.dataset.value =
                        action.value;

                    button.textContent =
                        action.label;

                    button.setAttribute(
                        "aria-label",
                        action.label
                    );

                    DOM.quickActions.appendChild(
                        button
                    );
                }
            );
        },

        // ========================================================
        // LOADING
        // ========================================================

        showLoading: function (show) {

            if (!DOM.loading) {
                return;
            }

            DOM.loading.style.display =
                show
                    ? "flex"
                    : "none";

            if (show) {

                const existing =
                    document.getElementById(
                        "yukasTypingIndicator"
                    );

                if (existing) {
                    existing.remove();
                }

                const typing =
                    document.createElement(
                        "div"
                    );

                typing.id =
                    "yukasTypingIndicator";

                typing.className =
                    "yukas-chat-typing";

                typing.setAttribute(
                    "role",
                    "status"
                );

                typing.setAttribute(
                    "aria-live",
                    "polite"
                );

                typing.innerHTML = `
                    <span></span>
                    <span></span>
                    <span></span>

                    <span
                        style="
                            margin-left:8px;
                            color:rgba(255,255,255,0.5);
                            font-size:0.8rem;
                        "
                    >
                        YUKAS AI is thinking...
                    </span>
                `;

                DOM.messages.appendChild(
                    typing
                );

                this.scrollToBottom();

            } else {

                const typing =
                    document.getElementById(
                        "yukasTypingIndicator"
                    );

                if (typing) {
                    typing.remove();
                }
            }
        },

        // ========================================================
        // ERROR
        // ========================================================

        showError: function (
            message
        ) {

            // Remove previous error.

            const previous =
                DOM.messages.querySelector(
                    ".yukas-chat-error"
                );

            if (previous) {
                previous.remove();
            }

            const errorDiv =
                document.createElement(
                    "div"
                );

            errorDiv.className =
                "yukas-chat-error";

            errorDiv.setAttribute(
                "role",
                "alert"
            );

            const icon =
                document.createElement(
                    "span"
                );

            icon.textContent =
                "⚠️";

            icon.setAttribute(
                "aria-hidden",
                "true"
            );

            const text =
                document.createElement(
                    "span"
                );

            text.style.flex = "1";

            text.textContent =
                Utils.sanitizeText(
                    message,
                    500
                );

            const retry =
                document.createElement(
                    "button"
                );

            retry.type =
                "button";

            retry.className =
                "yukas-chat-retry";

            retry.textContent =
                "Retry";

            retry.style.cssText = `
                background:#2563EB;
                color:#fff;
                border:none;
                padding:5px 12px;
                border-radius:6px;
                cursor:pointer;
                font-size:0.8rem;
            `;

            retry.addEventListener(
                "click",
                function () {

                    Chatbot.retryLastMessage();
                }
            );

            errorDiv.appendChild(
                icon
            );

            errorDiv.appendChild(
                text
            );

            errorDiv.appendChild(
                retry
            );

            DOM.messages.appendChild(
                errorDiv
            );

            this.scrollToBottom();
        },

        // ========================================================
        // BADGE
        // ========================================================

        updateBadge: function (
            hasNewMessage
        ) {

            if (!DOM.badge) {
                return;
            }

            if (hasNewMessage) {

                DOM.badge.classList.add(
                    "show"
                );

            } else {

                DOM.badge.classList.remove(
                    "show"
                );
            }
        },

        // ========================================================
        // SCROLL
        // ========================================================

        scrollToBottom: function () {

            if (!DOM.messages) {
                return;
            }

            requestAnimationFrame(
                function () {

                    DOM.messages.scrollTop =
                        DOM.messages.scrollHeight;
                }
            );
        },

        // ========================================================
        // GET HISTORY
        // ========================================================

        getConversationHistory: function () {

            return History.get();
        },

        // ========================================================
        // CLEAR CHAT
        // ========================================================

        clearConversation: function () {

            History.clear();

            DOM.messages.innerHTML = "";

            this.addWelcomeMessage();

            this.addQuickActions();

            Utils.log(
                "Conversation cleared."
            );
        }
    };

    // ============================================================
    // INITIALIZE
    // ============================================================

    function initialize() {

        Chatbot.init();
    }

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    window.YUKAS_AI = {

        __initialized: true,

        open: function () {
            Chatbot.openChat();
        },

        close: function () {
            Chatbot.closeChat();
        },

        toggle: function () {
            Chatbot.toggleChat();
        },

        clear: function () {
            Chatbot.clearConversation();
        },

        retry: function () {
            Chatbot.retryLastMessage();
        },

        getHistory: function () {
            return Chatbot.getConversationHistory();
        },

        version: "2.0.0",

        config: CONFIG
    };

})();
