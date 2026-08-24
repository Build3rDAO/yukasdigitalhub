// ============================================================
// YUKAS AI V2 - CORRECTED PRODUCTION IMPLEMENTATION
// ============================================================

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validate environment variable
if (!process.env.GOOGLE_API_KEY) {
  console.error('ERROR: GOOGLE_API_KEY environment variable is not set');
}

// Initialize Gemini with the currently installed SDK version
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
} catch (error) {
  console.error('Failed to initialize Gemini:', error);
}

// ============================================================
// SYSTEM PROMPT - VERIFIED YUKAS DIGITAL HUB INFORMATION ONLY
// ============================================================
const SYSTEM_PROMPT = `
You are YUKAS AI, the official AI assistant of YUKAS DIGITAL HUB.

=== COMPANY IDENTITY ===
YUKAS DIGITAL HUB is a premium AI and digital solutions provider. We help African businesses scale with innovative technology.

=== VERIFIED SERVICES (FROM WEBSITE) ===
1. AI Development - Custom AI models, machine learning, predictive analytics
2. AI Website Development - High-performance websites with AI integration
3. Website Development - Business websites, e-commerce, real estate, portfolios
4. WhatsApp Automation - AI chatbots and automation for WhatsApp Business
5. Business Automation - Workflow automation, CRM setup, email automation
6. Brand Identity - Logo design, brand guidelines, stationery, social media kits
7. UI/UX Design - User research, wireframing, prototyping, visual design
8. Cloud Solutions - Cloud migration, infrastructure, security, optimization

=== VERIFIED STARTING PRICES (FROM WEBSITE) ===
- Website Development: ₦150,000
- AI Website Development: ₦150,000
- Brand Identity: ₦150,000
- UI/UX Design: ₦200,000
- WhatsApp Automation: ₦200,000
- Business Automation: ₦250,000
- Cloud Solutions: ₦300,000
- AI Development: ₦500,000

IMPORTANT: These are STARTING prices only. Final cost depends on project scope.

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
- Hausa responses should be natural Nigerian Hausa

=== CONVERSATIONAL RULES ===
- Don't dump a list of services unless asked
- Don't immediately say "Contact us for a quote"
- Have a natural conversation
- Ask 1-2 relevant questions at a time
- Use emojis sparingly (😊, 👍, 👋 only when natural)
- Be warm, professional, and helpful
- Never be pushy or salesy

=== WHAT NOT TO DO ===
- Never invent prices not listed above
- Never invent services not listed above
- Never hallucinate company information (clients, testimonials, awards, etc.)
- Never ignore obvious Hausa meaning due to spelling mistakes
- Never ask too many questions at once

=== KNOWLEDGE LIMITS ===
If you don't know something, say: "I don't have that information available right now, but I can help you with..."

=== WHATSAPP HANDOFF ===
When appropriate (serious projects, quotes, detailed discussion), suggest:
"Za mu iya ci gaba da tattaunawa a WhatsApp don cikakken bayani."
WhatsApp number: 0704 350 4297
`;

// ============================================================
// INTENT CLASSIFICATION - WITH CORRECT PRIORITY
// ============================================================
function classifyIntent(message) {
  const lower = message.toLowerCase();
  
  // 1. GREETING - Check first
  const greetings = ['barka da safiya', 'barka da safe', 'barka da rana', 'barka da yamma',
                     'barka da dare', 'sannu', 'sannu da zuwa', 'in kwana', 'hello', 'hi', 'hey'];
  if (greetings.some(g => lower.includes(g))) return 'GREETING';
  
  // 2. CONTACT/HUMAN
  const contactKeywords = ['talk to someone', 'human', 'person', 'call', 'phone', 'contact'];
  if (contactKeywords.some(w => lower.includes(w))) return 'CONTACT';
  
  // 3. PRICING
  const pricingKeywords = ['nawa', 'farashi', 'kudi', 'cost', 'price', 'how much'];
  if (pricingKeywords.some(w => lower.includes(w))) return 'PRICING';
  
  // 4. E-COMMERCE - Check before generic website
  if (lower.includes('shop') || lower.includes('store') || lower.includes('e-commerce') || lower.includes('kantin')) {
    return 'E_COMMERCE';
  }
  
  // 5. REAL ESTATE
  if (lower.includes('real estate') || lower.includes('gida') || lower.includes('property')) {
    return 'REAL_ESTATE';
  }
  
  // 6. WHATSAPP AUTOMATION - Check before generic automation
  if (lower.includes('whatsapp') && (lower.includes('automation') || lower.includes('bot') || lower.includes('chatbot'))) {
    return 'WHATSAPP_AUTOMATION';
  }
  
  // 7. BUSINESS AUTOMATION - Check before generic automation
  if (lower.includes('automation') && (lower.includes('business') || lower.includes('workflow') || lower.includes('crm'))) {
    return 'BUSINESS_AUTOMATION';
  }
  
  // 8. AI CHATBOT - Check before generic AI
  if (lower.includes('chatbot') || lower.includes('chat bot')) {
    return 'AI_CHATBOT';
  }
  
  // 9. AI SOLUTION - Check before generic website
  const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'predictive', 'nlp', 'computer vision'];
  if (aiKeywords.some(w => lower.includes(w))) return 'AI_SOLUTION';
  
  // 10. UI/UX
  if (lower.includes('ui') || lower.includes('ux') || lower.includes('user interface') || lower.includes('user experience')) {
    return 'UI_UX';
  }
  
  // 11. GRAPHIC DESIGN / BRANDING
  const designKeywords = ['brand', 'logo', 'design', 'graphic', 'identity'];
  if (designKeywords.some(w => lower.includes(w))) return 'GRAPHIC_DESIGN';
  
  // 12. WEBSITE - Last priority after more specific matches
  const websiteKeywords = ['website', 'web', 'site', 'shafi', 'gidan yanar gizo', 'aga', 'aginamin',
                           'gina website', 'build website', 'make website'];
  if (websiteKeywords.some(w => lower.includes(w))) return 'WEBSITE_DEVELOPMENT';
  
  return 'GENERAL_QUESTION';
}

// ============================================================
// HAUSA LANGUAGE DETECTION - IMPROVED
// ============================================================
function isHausa(text) {
  // Check for common Hausa patterns that don't appear in English
  const hausaIndicators = [
    // Common Hausa words that don't overlap with English
    'barka', 'sannu', 'yaya', 'nawa', 'taya', 
    'buƙata', 'buqata', 'ƙara', 'qara',
    'harshen', 'harshe', 'wane', 'wacce', 'wadanne',
    'ne', 'ce', 'shi', 'ita', 'su', 'mu', 'ku',
    'ka', 'ki', 'ga', 'don', 'saboda', 'domin', 'gama',
    'amma', 'ko', 'kuma', 'to', 'tabbas', 'madalla'
  ];
  
  // Strong Hausa patterns
  const strongPatterns = [
    'ina son', 'ina so', 'ina bukatar', 'ina buqatar',
    'zan so', 'zaka so', 'zaki so', 'zamu so',
    'neman', 'tambaya', 'gina website', 'aginamin',
    'na son', 'na so', 'na bukatar'
  ];
  
  const lower = text.toLowerCase();
  
  // Check strong patterns first
  if (strongPatterns.some(p => lower.includes(p))) return true;
  
  // Count Hausa indicators
  const words = lower.split(/\s+/);
  const hausaCount = words.filter(w => hausaIndicators.some(ind => w.includes(ind))).length;
  
  // If there are multiple Hausa indicators, it's likely Hausa
  if (hausaCount >= 2) return true;
  
  // Check for Hausa-English mixed patterns
  const mixedPatterns = ['ina son website', 'ina bukatar website', 'zan so shop', 'ina son business'];
  if (mixedPatterns.some(p => lower.includes(p))) return true;
  
  return false;
}

// ============================================================
// GENERATE RESPONSE FUNCTION
// ============================================================
async function generateResponse(userMessage, history) {
  try {
    if (!genAI) {
      throw new Error('Gemini not initialized');
    }

    const isHausaUser = isHausa(userMessage);
    const intent = classifyIntent(userMessage);
    
    // Use a stable, supported Gemini model
    // gemini-1.5-flash is stable and widely available
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
    
    // Add previous messages (last 6 for context)
    const historyLimit = 6;
    const recentHistory = history.slice(-historyLimit);
    
    for (const msg of recentHistory) {
      if (msg.role === 'user') {
        conversationHistory += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        conversationHistory += `Assistant: ${msg.content}\n\n`;
      }
    }
    
    // Add current message with context
    conversationHistory += `User: ${userMessage}\nAssistant:`;

    // Add intent context
    const intentContext = `
Intent: ${intent}
User Language: ${isHausaUser ? 'Hausa' : 'English'}`;

    const fullPrompt = conversationHistory + intentContext;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let reply = response.text().trim();

    // Clean up common issues
    reply = reply.replace(/^Assistant:\s*/i, '');
    reply = reply.replace(/^AI:\s*/i, '');
    reply = reply.replace(/Assistant:/gi, '');

    return reply;

  } catch (error) {
    console.error('Error generating response:', error);
    const isHausaUser = isHausa(userMessage);
    if (isHausaUser) {
      return 'Na gode da tambayarka. Na ɗan sami matsala wajen samar da amsa. Za mu iya ci gaba da tattaunawa a WhatsApp don cikakken bayani.';
    }
    return 'Thank you for your message. I\'m having a moment, but I\'d love to help. Could we continue this conversation on WhatsApp for more details?';
  }
}

// ============================================================
// VERCELL SERVERLESS FUNCTION
// ============================================================
module.exports = async (req, res) => {
  // CORS - Use specific origin for production
  const allowedOrigins = [
    'https://yukasdigitalhub.vercel.app',
    'https://yukasdigitalhub.com',
    'http://localhost:3000',
    'http://localhost:5000'
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Fallback for development
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
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

    const trimmedMessage = message.trim().slice(0, 500);

    // Validate history - only allow 'user' and 'assistant' roles
    let safeHistory = [];
    if (Array.isArray(history)) {
      const validRoles = ['user', 'assistant'];
      safeHistory = history
        .filter(msg => msg && typeof msg === 'object' && validRoles.includes(msg.role) && msg.content)
        .slice(-10)
        .map(msg => ({
          role: msg.role,
          content: msg.content.slice(0, 500)
        }));
    }

    // Generate response
    const reply = await generateResponse(trimmedMessage, safeHistory);

    return res.status(200).json({ message: reply });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Unable to process request. Please try again later.'
    });
  }
};
