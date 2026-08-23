// api/chat.js - Vercel Serverless Function for YUKAS AI Chatbot

// This is a serverless function that securely handles AI chat requests
// It never exposes the OpenAI API key to the browser

export default async function handler(req, res) {
    // ========== CORS HEADERS ==========
    // Allow requests from your domain
    const allowedOrigins = [
        'https://yukasdigitalhub.vercel.app',
        'https://yukasdigitalhub.com',
        'http://localhost:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ========== HANDLE PREFLIGHT OPTIONS REQUEST ==========
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ========== VALIDATE REQUEST METHOD ==========
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed. Only POST requests are accepted.' 
        });
    }

    // ========== VALIDATE OPENAI API KEY ==========
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('OPENAI_API_KEY is not set in environment variables');
        return res.status(500).json({ 
            error: 'Server configuration error. Please try again later.' 
        });
    }

    // ========== GET AND VALIDATE REQUEST BODY ==========
    let messages;
    try {
        const body = req.body;
        messages = body.messages;
        
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ 
                error: 'Invalid request. "messages" array is required.' 
            });
        }
    } catch (error) {
        return res.status(400).json({ 
            error: 'Invalid request format.' 
        });
    }

    // ========== VALIDATE MESSAGE CONTENT ==========
    const MAX_MESSAGE_LENGTH = 500;
    for (const msg of messages) {
        if (!msg.role || !msg.content) {
            return res.status(400).json({ 
                error: 'Each message must have a "role" and "content".' 
            });
        }
        if (msg.content.length > MAX_MESSAGE_LENGTH) {
            return res.status(400).json({ 
                error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.` 
            });
        }
    }

    // ========== LIMIT CONVERSATION HISTORY ==========
    // Keep only the most recent 20 messages to prevent token overflow
    const MAX_HISTORY = 20;
    if (messages.length > MAX_HISTORY) {
        messages = messages.slice(-MAX_HISTORY);
    }

    // ========== YUKAS AI SYSTEM PROMPT ==========
    const systemPrompt = `You are YUKAS AI, the official AI assistant for YUKAS DIGITAL HUB.

## ABOUT YUKAS DIGITAL HUB
YUKAS DIGITAL HUB is a premium AI technology company based in Kano, Nigeria. We help African businesses scale smarter with AI solutions, automation, and modern digital products.

## OUR SERVICES
- AI Development: Custom AI models, machine learning, predictive analytics, NLP, computer vision
- AI Website Development: High-performance, AI-integrated websites
- WhatsApp Automation: Intelligent chatbots and automation for WhatsApp Business
- Brand Identity: Logos, brand guidelines, stationery design
- Business Automation: Workflow automation, CRM, email marketing automation
- UI/UX Design: User research, wireframing, prototyping, design systems
- Cloud Solutions: Cloud migration, infrastructure, security

## YOUR PERSONALITY
- Professional, helpful, and friendly
- You represent a premium technology company
- You speak clearly and concisely
- You never invent information - if you don't know something, say so

## IMPORTANT RULES
1. NEVER invent pricing - say: "The final price depends on the project scope. I can help you define your requirements so the team can provide an accurate quote."
2. NEVER invent testimonials - only use real ones if provided
3. NEVER invent client names or case studies
4. NEVER claim to be a human - say: "I'm YUKAS AI, the AI assistant for YUKAS DIGITAL HUB."
5. For serious project inquiries, ask relevant questions naturally:
   - What type of business do you have?
   - What are you looking to build?
   - What problem are you trying to solve?
   - What features do you need?
   - Do you have an existing website or system?
6. Direct users to WhatsApp (0704 350 4297) when they want:
   - Project consultation
   - Custom quote
   - Human support
   - Detailed discussion
   - Custom development

## LANGUAGE SUPPORT
- If the user writes in English, respond in English
- If the user writes in Hausa, respond in natural Hausa
- If the user mixes languages, respond in the same mixed style naturally

## WELCOME MESSAGE
Start with: "👋 Hello! I'm YUKAS AI, the AI assistant for YUKAS DIGITAL HUB. I can help you learn about our AI solutions, website development, automation, and more. How can I help you today?"

Remember: You represent YUKAS DIGITAL HUB - be professional, helpful, and trustworthy.`;

    // ========== PREPARE MESSAGES FOR OPENAI ==========
    const openAIMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
    ];

    // ========== GET MODEL FROM ENVIRONMENT ==========
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    // ========== CALL OPENAI API ==========
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: openAIMessages,
                temperature: 0.7,
                max_tokens: 500,
                stream: false
            })
        });

        const data = await response.json();

        // ========== HANDLE OPENAI API ERRORS ==========
        if (!response.ok) {
            console.error('OpenAI API Error:', data);
            
            // Handle rate limiting
            if (response.status === 429) {
                return res.status(429).json({ 
                    error: 'We are experiencing high traffic. Please try again in a moment.' 
                });
            }
            
            // Handle other API errors
            return res.status(response.status).json({ 
                error: 'Unable to process your request. Please try again later.' 
            });
        }

        // ========== EXTRACT AND RETURN RESPONSE ==========
        const assistantMessage = data.choices[0]?.message?.content;
        
        if (!assistantMessage) {
            return res.status(500).json({ 
                error: 'Unable to generate a response. Please try again.' 
            });
        }

        return res.status(200).json({ 
            message: assistantMessage 
        });

    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return res.status(500).json({ 
            error: 'Something went wrong. Please try again or reach out via WhatsApp.' 
        });
    }
}
