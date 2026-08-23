// api/chat.js - Google Gemini AI Integration (FREE Tier)
// Get your free API key at: https://aistudio.google.com/

export default async function handler(req, res) {
    // ========== CORS HEADERS ==========
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

    // ========== VALIDATE GEMINI API KEY ==========
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
        console.error('❌ GOOGLE_API_KEY is not set in environment variables');
        console.log('💡 Get your free API key at: https://aistudio.google.com/');
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
    const MAX_HISTORY = 20;
    if (messages.length > MAX_HISTORY) {
        messages = messages.slice(-MAX_HISTORY);
    }

    // ========== GET THE LAST USER MESSAGE ==========
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) {
        return res.status(400).json({ 
            error: 'No user message found.' 
        });
    }

    // ========== GEMINI SYSTEM PROMPT ==========
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

Remember: You represent YUKAS DIGITAL HUB - be professional, helpful, and trustworthy.`;

    // ========== BUILD THE CONVERSATION CONTEXT ==========
    let conversationContext = systemPrompt + '\n\n';
    
    for (const msg of messages) {
        if (msg.role === 'user') {
            conversationContext += `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
            conversationContext += `Assistant: ${msg.content}\n`;
        }
    }
    
    const userMessage = lastUserMessage.content;

    // ================================================================
    // ✅ CORRECT GEMINI MODEL NAMES - Choose one:
    // ================================================================
    // 
    // Model Name             | Best For
    // -----------------------|----------------------------------------
    // gemini-3-flash         | ✅ FASTEST, best for chat
    // gemini-2.5-flash       | ✅ Good balance of speed and quality  
    // gemini-3.1-flash-lite  | ✅ CHEAPEST, for simple tasks
    // gemini-3-pro           | ✅ Best quality
    // gemini-3.1-flash       | ✅ Newest model
    // 
    // ================================================================

    const model = process.env.GEMINI_MODEL || 'gemini-3-flash';

    console.log('📡 Using Gemini model:', model);

    // ========== CALL GEMINI API ==========
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: conversationContext + `\nUser: ${userMessage}\nAssistant:`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                        topP: 0.9,
                        topK: 40,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        // ========== HANDLE GEMINI API ERRORS ==========
        if (!response.ok) {
            console.error('❌ Gemini API Error:', data);
            
            // Check for model not found error
            if (data.error?.message?.includes('not found')) {
                return res.status(400).json({ 
                    error: `The model "${model}" is not available. Please use one of: gemini-3-flash, gemini-2.5-flash, gemini-3.1-flash-lite, or gemini-3-pro.` 
                });
            }
            
            // Check for rate limiting or quota errors
            if (data.error?.code === 429) {
                return res.status(429).json({ 
                    error: 'You have exceeded the free Gemini rate limit. Please try again in a moment.' 
                });
            }
            
            if (data.error?.message?.includes('quota')) {
                return res.status(429).json({ 
                    error: 'You have exceeded your Gemini daily quota. Please try again tomorrow.' 
                });
            }
            
            return res.status(response.status).json({ 
                error: data.error?.message || 'Unable to process your request. Please try again later.' 
            });
        }

        // ========== EXTRACT AND RETURN RESPONSE ==========
        const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!assistantMessage) {
            console.error('❌ No response from Gemini:', data);
            return res.status(500).json({ 
                error: 'Unable to generate a response. Please try again.' 
            });
        }

        return res.status(200).json({ 
            message: assistantMessage.trim()
        });

    } catch (error) {
        console.error('❌ Error calling Gemini API:', error);
        return res.status(500).json({ 
            error: 'Something went wrong. Please try again or reach out via WhatsApp.' 
        });
    }
}
