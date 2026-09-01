/**
 * ============================================================
 * YUKAS DIGITAL HUB — Project Data Layer
 * ============================================================
 * Version: 2.0.0
 * 
 * This file contains all project data for the portfolio.
 * All information should be verified before publishing.
 * ============================================================
 */

const PROJECTS = {
    // ============================================================
    // CLIENT PROJECTS
    // ============================================================
    
    kwararre: {
        slug: 'kwararre-land-agent',
        title: 'Kwararre Land Agent',
        category: 'Real Estate',
        subcategory: 'Web Development',
        type: 'Client Project',
        status: 'Launched',
        year: '2024',
        location: 'Nigeria',
        role: 'Web Design & Development',
        featured: true,
        
        description: 'A premium real estate platform connecting property seekers with verified agents. The website features property listings, agent profiles, and a modern UI designed to build trust and showcase properties effectively.',
        
        problem: 'The real estate market in Nigeria suffers from fragmented listings and untrustworthy agents. Kwararre Land Agent needed a platform that would establish credibility and provide a seamless property search experience.',
        
        solution: 'YDH designed and built a modern real estate website with advanced property search, agent verification, and a clean interface that prioritizes user experience and trust.',
        
        features: [
            'Property listings with advanced search filters',
            'Agent profiles with verification badges',
            'Property comparison tool',
            'Contact & inquiry forms',
            'Mobile-responsive design',
            'Modern UI/UX with dark theme'
        ],
        
        technology: [
            'HTML5/CSS3',
            'JavaScript',
            'Responsive Design',
            'Modern UI/UX'
        ],
        
        services: [
            'UI/UX Design',
            'Web Development',
            'Brand Identity'
        ],
        
        outcome: 'A premium real estate platform that positions Kwararre Land Agent as a trusted name in the Nigerian property market.',
        
        image: 'images/portfolio/kwararre.jpg',
        images: [
            'images/portfolio/kwararre-1.jpg',
            'images/portfolio/kwararre-2.jpg'
        ],
        
        liveUrl: 'https://kwararrelandagent.com',
        githubUrl: null
    },

    sassauchi: {
        slug: 'sassauchi-enterprises',
        title: 'Sassauchi Enterprises',
        category: 'Business',
        subcategory: 'Web Development',
        type: 'Client Project',
        status: 'Launched',
        year: '2024',
        location: 'Nigeria',
        role: 'Web Design & Development',
        featured: true,
        
        description: 'A professional business website for Sassauchi Enterprises, showcasing their services and building credibility in the market.',
        
        problem: 'Sassauchi Enterprises needed a professional online presence that would establish credibility and attract potential clients.',
        
        solution: 'YDH delivered a clean, professional website with a focus on clear messaging and user experience.',
        
        features: [
            'Professional layout',
            'Service showcase',
            'Contact forms',
            'Mobile-responsive design'
        ],
        
        technology: [
            'HTML5/CSS3',
            'JavaScript',
            'Responsive Design'
        ],
        
        services: [
            'Web Development',
            'UI/UX Design'
        ],
        
        image: 'images/portfolio/sassauchi.jpg',
        liveUrl: 'https://sassauchienterprises.com'
    },

    amam: {
        slug: 'amam-properties',
        title: 'AMAM Properties',
        category: 'Real Estate',
        subcategory: 'Web Development',
        type: 'Client Project',
        status: 'Launched',
        year: '2024',
        location: 'Nigeria',
        role: 'Web Design & Development',
        featured: true,
        
        description: 'A modern real estate website for AMAM Properties, featuring property showcase, lead generation, and professional design.',
        
        problem: 'AMAM Properties needed to establish a strong online presence to attract property buyers and investors.',
        
        solution: 'YDH built a modern real estate platform with a focus on visual storytelling and lead generation.',
        
        features: [
            'Property showcase',
            'Lead generation forms',
            'Investment calculator',
            'Mobile-responsive design'
        ],
        
        technology: [
            'HTML5/CSS3',
            'JavaScript',
            'Responsive Design'
        ],
        
        services: [
            'Web Development',
            'UI/UX Design'
        ],
        
        image: 'images/portfolio/amam.jpg',
        liveUrl: 'https://amampropertiess.com'
    },

    // ============================================================
    // YDH PRODUCTS
    // ============================================================

    saraky: {
        slug: 'saraky-data-sub',
        title: 'SARAKY DATA SUB',
        category: 'FinTech',
        subcategory: 'Digital Services',
        type: 'YDH Product',
        status: 'Launched',
        year: '2024',
        location: 'Nigeria',
        role: 'Product Development',
        featured: true,
        
        description: 'A comprehensive VTU and digital services platform enabling users to purchase airtime, data, and pay bills instantly. A full-featured fintech product built from the ground up.',
        
        problem: 'Users need a reliable, fast, and easy-to-use platform for purchasing airtime, data, and paying bills without hassle.',
        
        solution: 'YDH developed SARAKY DATA SUB as a complete digital services platform with user accounts, wallet, and seamless payment integration.',
        
        features: [
            'User accounts & authentication',
            'Wallet system',
            'Airtime & data purchases',
            'Cable TV & electricity bill payment',
            'Transaction history',
            'Referral system'
        ],
        
        technology: [
            'PHP',
            'MySQL',
            'Monnify Integration',
            'VTU API Integration',
            'Responsive Frontend'
        ],
        
        services: [
            'Product Development',
            'UI/UX Design',
            'Payment Integration'
        ],
        
        image: 'images/portfolio/saraky.jpg',
        liveUrl: 'https://sarakydatasub.com'
    },

    ydhConnect: {
        slug: 'ydh-connect',
        title: 'YDH Connect',
        category: 'AI & Automation',
        subcategory: 'Business Automation',
        type: 'YDH Product',
        status: 'In Development',
        year: '2024',
        location: 'Nigeria',
        role: 'Product Development',
        featured: true,
        
        description: 'A business communication and automation platform that helps companies manage customer interactions across multiple channels using AI and workflow automation.',
        
        problem: 'Businesses struggle to manage customer communications across multiple channels while maintaining context and providing timely responses.',
        
        solution: 'YDH Connect provides a unified platform for managing customer communications with AI-powered responses, workflow automation, and seamless channel integration.',
        
        features: [
            'Multi-channel communication (WhatsApp, Web, Email)',
            'AI-powered responses',
            'Customer context management',
            'Workflow automation',
            'Tool integration',
            'Analytics dashboard'
        ],
        
        technology: [
            'Python',
            'FastAPI',
            'SQLAlchemy',
            'Alembic',
            'AI API Integration',
            'WhatsApp API'
        ],
        
        services: [
            'Product Development',
            'AI Integration',
            'System Architecture'
        ],
        
        image: 'images/portfolio/ydh-connect.jpg'
    },

    yukasAI: {
        slug: 'yukas-ai',
        title: 'YUKAS AI',
        category: 'AI & Automation',
        subcategory: 'AI Assistant',
        type: 'YDH Product',
        status: 'Launched',
        year: '2024',
        location: 'Nigeria',
        role: 'Product Development',
        featured: true,
        
        description: 'An intelligent AI assistant that helps businesses automate customer interactions, qualify leads, and provide instant support across multiple channels.',
        
        problem: 'Businesses need a way to handle customer inquiries 24/7 without hiring expensive round-the-clock support teams.',
        
        solution: 'YUKAS AI is a smart AI assistant that handles customer inquiries, qualifies leads, and can be integrated into websites, WhatsApp, and other platforms.',
        
        features: [
            'Natural language understanding',
            'Multi-language support (English & Hausa)',
            'Lead qualification',
            'WhatsApp integration',
            'Website widget',
            'Handoff to human agents'
        ],
        
        technology: [
            'Google Gemini AI',
            'JavaScript',
            'Python (API)',
            'WhatsApp API',
            'Vercel Deployment'
        ],
        
        services: [
            'AI Development',
            'Product Development',
            'System Integration'
        ],
        
        image: 'images/portfolio/yukas-ai.jpg'
    },

    // ============================================================
    // CONCEPT / EXPERIMENTAL
    // ============================================================

    paragon: {
        slug: 'paragon-protocol',
        title: 'Paragon Protocol',
        category: 'Web3',
        subcategory: 'Experimental',
        type: 'Concept / Experimental',
        status: 'Concept',
        year: '2024',
        location: 'Nigeria',
        role: 'Product Design',
        featured: false,
        
        description: 'A Web3 UI/UX concept exploring decentralized finance interfaces and blockchain interactions. This project demonstrates YDH\'s ability to design for emerging technologies.',
        
        problem: 'Web3 interfaces are often complex and confusing for mainstream users. Paragon Protocol explores how to make DeFi more accessible.',
        
        solution: 'A clean, modern interface that demystifies blockchain interactions and makes decentralized finance more approachable.',
        
        features: [
            'Clean Web3 UI/UX',
            'DeFi interface design',
            'Blockchain transaction visualization',
            'Wallet connectivity design'
        ],
        
        technology: [
            'Web3 Design Patterns',
            'UI/UX Design'
        ],
        
        services: [
            'UI/UX Design',
            'Product Strategy'
        ],
        
        image: 'images/portfolio/paragon.jpg'
    }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function getProject(slug) {
    return PROJECTS[slug] || null;
}

function getAllProjects() {
    return Object.values(PROJECTS);
}

function getFeaturedProjects() {
    return Object.values(PROJECTS).filter(p => p.featured === true);
}

function getProjectsByType(type) {
    return Object.values(PROJECTS).filter(p => p.type === type);
}

function getProjectsByCategory(category) {
    return Object.values(PROJECTS).filter(p => p.category === category);
}

// ============================================================
// EXPOSE
// ============================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PROJECTS,
        getProject,
        getAllProjects,
        getFeaturedProjects,
        getProjectsByType,
        getProjectsByCategory
    };
}

console.log('✅ YUKAS DIGITAL HUB — Project data loaded');
