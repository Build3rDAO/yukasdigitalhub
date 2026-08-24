// ============================================================
// YUKAS AI V2 - Production-Ready Chatbot Backend
// ============================================================

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validate environment variable
if (!process.env.GOOGLE_API_KEY) {
  console.error('ERROR: GOOGLE_API_KEY environment variable is not set');
}

// Initialize Gemini with fallback
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
} catch (error) {
  console.error('Failed to initialize Gemini:', error);
}

// ============================================================
// SYSTEM PROMPT - YUKAS AI V2 IDENTITY
// ============================================================
const SYSTEM_PROMPT = `
You are YUKAS AI, the official AI assistant of YUKAS DIGITAL HUB.

=== COMPANY IDENTITY ===
YUKAS DIGITAL HUB is a premium AI and digital solutions provider based in Kano, Nigeria. We help African businesses scale with innovative technology.

=== ACTUAL SERVICES (FROM WEBSITE) ===
1. AI Development - Custom AI models, machine learning, predictive analytics, NLP, computer vision
2. AI Website Development - High-performance websites with AI integration
3. Website Development - Business websites, e-commerce, real estate, portfolios
4. WhatsApp Automation - AI chatbots and automation for WhatsApp Business
5. Business Automation - Workflow automation, CRM setup, email automation
6. Brand Identity - Logo design, brand guidelines, stationery, social media kits
7. UI/UX Design - User research, wireframing, prototyping, visual design
8. Cloud Solutions - Cloud migration, infrastructure, security, optimization
9. Payment Integrations - Flutterwave, Paystack, Monnify, Interswitch, Remita, Paga

=== PRICING (FROM WEBSITE) ===
- Website Development: Starting from ₦150,000
- Brand Identity: ₦150,000 (complete package)
- UI/UX Design: Starting from ₦200,000
- WhatsApp Automation: Starting from ₦200,000
- Business Automation: Starting from ₦250,000
- Cloud Solutions: Starting from ₦300,000
- AI Development: Starting from ₦500,000

NOTE: These are starting prices. Final cost depends on project scope.

=== YOUR ROLE ===
1. Understand customer needs naturally
2. Ask 1-2 useful follow-up questions at a time (never interrogate)
3. Identify intent: GREETING, WEBSITE, AI, AUTOMATION, PRICING, etc.
4. Respond in the user's language (Hausa or English)
5. Guide serious customers to WhatsApp: 0704 350 4297
6. Never invent company information, prices, or services

=== LANGUAGE RULES ===
- If user writes in Hausa → respond in Hausa
- If user writes in English → respond in English  
- If user mixes languages → respond naturally with both
- Hausa responses should be natural Nigerian Hausa, not formal/robotic

=== HAUSA GREETINGS TO RECOGNIZE ===
Barka da safiya, Barka da rana, Barka da yamma, Barka da dare, Sannu, Sannu da zuwa, In kwana

=== INTENT DETECTION ===
Before responding, internally determine the user's intent:
GREETING, WEBSITE_DEVELOPMENT, E_COMMERCE, AI_SOLUTION, AI_CHATBOT, WHATSAPP_AUTOMATION, BUSINESS_AUTOMATION, UI_UX_DESIGN, GRAPHIC_DESIGN, REAL_ESTATE_WEBSITE, PRICING, PROJECT_QUOTE, CONTACT, GENERAL_QUESTION, UNKNOWN

Use this to craft an appropriate response.

=== CONVERSATIONAL RULES ===
- Don't dump a list of services unless asked
- Don't immediately say "Contact us for a quote"
- Have a natural conversation
- Ask 1-2 relevant questions at a time
- Use emojis sparingly (😊, 👍, 👋 only when natural)
- Be warm, professional, and helpful
- Never be pushy or salesy

=== HAUSA WEBSITE INQUIRY EXAMPLES ===
User: "inason za aginamin website"
Meaning: "I want you to build me a website"
Response: "Tabbas! Za mu iya taimaka maka gina website. 😊 Wane irin website kake so—business website, online store, real estate, school, portfolio, ko wani daban?"

User: "nawa ne website?"
Response: "Farashin website ya danganta da irin website da kake so da features. Idan ka gaya min irin website da kake bukata, zan taimaka maka tantance requirements."

=== WHAT NOT TO DO ===
- Never invent prices not listed above
- Never invent services not listed above
- Never say "Contact us for a quote" without understanding the need first
- Never ask too many questions at once
- Never ignore obvious Hausa meaning due to spelling mistakes
- Never respond to Hausa greetings with English generic responses
- Never hallucinate company information (clients, testimonials, awards, etc.)

=== KNOWLEDGE LIMITS ===
If you don't know something, say: "I don't have that information available right now, but I can help you with..."

=== WHATSAPP HANDOFF ===
When appropriate (serious projects, quotes, detailed discussion), suggest:
"Za mu iya ci gaba da tattaunawa a WhatsApp don cikakken bayani."

WhatsApp number: 0704 350 4297
`;

// ============================================================
// INTENT CLASSIFICATION FUNCTION
// ============================================================
function classifyIntent(message) {
  const lower = message.toLowerCase();
  
  // Greetings (Hausa & English)
  const greetings = ['barka da safiya', 'barka da safe', 'barka da rana', 'barka da yamma', 
                     'barka da dare', 'sannu', 'sannu da zuwa', 'in kwana', 'hello', 'hi', 'hey'];
  if (greetings.some(g => lower.includes(g))) return 'GREETING';
  
  // Website-related
  const websiteKeywords = ['website', 'web', 'site', 'shafi', 'gidan yanar gizo', 'aga', 'aginamin', 
                           'gina website', 'build website', 'make website'];
  if (websiteKeywords.some(w => lower.includes(w))) {
    if (lower.includes('shop') || lower.includes('store') || lower.includes('e-commerce') || lower.includes('kantin')) {
      return 'E_COMMERCE';
    }
    if (lower.includes('real estate') || lower.includes('gida') || lower.includes('property')) {
      return 'REAL_ESTATE_WEBSITE';
    }
    return 'WEBSITE_DEVELOPMENT';
  }
  
  // AI-related
  const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'predictive', 'nlp', 'computer vision'];
  if (aiKeywords.some(w => lower.includes(w))) return 'AI_SOLUTION';
  
  // Chatbot-related
  const chatbotKeywords = ['chatbot', 'bot', 'chat bot', 'automation', 'whatsapp bot'];
  if (chatbotKeywords.some(w => lower.includes(w))) {
    if (lower.includes('whatsapp')) return 'WHATSAPP_AUTOMATION';
    return 'AI_CHATBOT';
  }
  
  // Pricing
  const pricingKeywords = ['nawa', 'farashi', 'kudi', 'cost', 'price', 'how much', '多少钱'];
  if (pricingKeywords.some(w => lower.includes(w))) return 'PRICING';
  
  // Contact/human
  const contactKeywords = ['talk to someone', 'human', 'person', 'call', 'phone', 'contact'];
  if (contactKeywords.some(w => lower.includes(w))) return 'CONTACT';
  
  return 'GENERAL_QUESTION';
}

// ============================================================
// HAUSA DETECTION
// ============================================================
function isHausa(text) {
  const hausaWords = ['ina', 'na', 'ka', 'ki', 'mu', 'su', 'shi', 'ita', 'muna', 'kuna', 'suna',
                      'da', 'ga', 'don', 'saboda', 'domin', 'gama', 'amma', 'ko', 'kuma', 'to',
                      'barka', 'sannu', 'yaya', 'me', 'wane', 'wacce', 'wadanne', 'nawa', 'taya',
                      'zan', 'zaka', 'zaki', 'zamu', 'zasu', 'so', 'son', 'buƙata', 'buqata',
                      'website', 'web', 'shop', 'business', 'real estate', 'property'];
  
  const words = text.toLowerCase().split(/\s+/);
  const hausaCount = words.filter(w => hausaWords.includes(w)).length;
  return hausaCount >= 2 || text.includes('ina') || text.includes('na son') || text.includes('zan');
}

// ============================================================
// GENERATE RESPONSE FUNCTION
// ============================================================
async function generateResponse(userMessage, history) {
  try {
    if (!genAI) {
      throw new Error('Gemini not initialized');
    }

    // Determine language and intent
    const isHausaUser = isHausa(userMessage);
    const intent = classifyIntent(userMessage);
    
    // Use a stable Gemini model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.9
      }
    });

    // Build conversation context
    let conversationHistory = SYSTEM_PROMPT + '\n\n';
    
    // Add previous messages (last 6 for context, without duplication)
    const historyLimit = 6;
    const recentHistory = history.slice(-historyLimit);
    
    for (const msg of recentHistory) {
      if (msg.role === 'user') {
        conversationHistory += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        conversationHistory += `Assistant: ${msg.content}\n\n`;
      }
    }
    
    // Add current message (only once)
    conversationHistory += `User: ${userMessage}\nAssistant:`;

    // Add context about intent and language detection
    const intentContext = `
Intent: ${intent}
User Language: ${isHausaUser ? 'Hausa' : 'English'}

Based on the intent and language above, respond naturally in the appropriate language.`;

    const fullPrompt = conversationHistory + intentContext;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let reply = response.text().trim();

    // Clean up common issues
    reply = reply.replace(/^Assistant:\s*/i, '');
    reply = reply.replace(/^AI:\s*/i, '');
    
    // Remove any leftover "Assistant:" prefixes
    reply = reply.replace(/Assistant:/gi, '');

    return reply;

  } catch (error) {
    console.error('Error generating response:', error);
    // Provide a graceful fallback based on language
    const isHausaUser = isHausa(userMessage);
    if (isHausaUser) {
      return 'Na gode da tambayarka. 🌟 Na ɗan sami matsala wajen samar da amsa. Za mu iya ci gaba da tattaunawa a WhatsApp don cikakken bayani.';
    }
    return 'Thank you for your message. 🌟 I\'m having a moment, but I\'d love to help. Could we continue this conversation on WhatsApp for more details?';
  }
}

// ============================================================
// VERCELL SERVERLESS FUNCTION
// ============================================================
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [] } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Trim and limit message length
    const trimmedMessage = message.trim().slice(0, 500);

    // Validate history
    let safeHistory = [];
    if (Array.isArray(history)) {
      safeHistory = history
        .filter(msg => msg && typeof msg === 'object' && msg.role && msg.content)
        .slice(-10)
        .map(msg => ({
          role: msg.role,
          content: msg.content.slice(0, 500)
        }));
    }

    // Generate response
    const reply = await generateResponse(trimmedMessage, safeHistory);

    // Return response
    return res.status(200).json({ message: reply });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Unable to process request. Please try again later.' 
    });
  }
};
