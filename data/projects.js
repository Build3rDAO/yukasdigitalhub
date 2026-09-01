/* ============================================
   YUKAS DIGITAL HUB — PROJECT DATA
   Version: 2.0.0
   Central source of truth for all portfolio projects
   ============================================ */

const YDH_PROJECTS = [
    // ============================================
    // CLIENT PROJECTS
    // ============================================

    {
        id: 'kwararre-land-agent',
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
        featuredOrder: 1,
        description: 'A premium real estate platform connecting property buyers with verified agents. Features property listings, agent profiles, and lead generation tools.',
        problem: 'The real estate market lacked a trusted digital platform where buyers could find verified properties and agents. Existing solutions were fragmented and lacked credibility.',
        solution: 'We built a comprehensive real estate platform with verified agent profiles, property listings with high-quality imagery, and an intuitive lead generation system.',
        features: [
            'Property listings with advanced search',
            'Verified agent profiles with ratings',
            'Lead generation and inquiry system',
            'Property showcase with high-res imagery',
            'Mobile-responsive design',
            'SEO-optimized architecture'
        ],
        workflow: 'Users can browse properties, filter by location and price, view agent profiles, and submit inquiries directly through the platform.',
        technology: [
            'HTML5',
            'CSS3',
            'JavaScript',
            'PHP',
            'MySQL',
            'Responsive Design'
        ],
        services: ['Web Design', 'Web Development', 'UI/UX Design', 'SEO'],
        outcome: 'A trusted real estate platform that has facilitated numerous property transactions and built a community of verified agents.',
        images: {
            hero: '/images/projects/kwararre-hero.jpg',
            thumbnail: '/images/portfolio/kla.png',
            gallery: [
                '/images/projects/kwararre-1.jpg',
                '/images/projects/kwararre-2.jpg'
            ]
        },
        liveUrl: 'https://kwararrelandagent.com',
        githubUrl: null,
        testimonial: null
    },

    {
        id: 'sassauchi-enterprises',
        slug: 'sassauchi-enterprises',
        title: 'Sassauchi Enterprises',
        category: 'Real Estate',
        subcategory: 'Business Website',
        type: 'Client Project',
        status: 'Launched',
        year: '2024',
        location: 'Nigeria',
        role: 'Web Design & Development',
        featured: true,
        featuredOrder: 2,
        description: 'A professional business website for a real estate enterprise, showcasing their portfolio and services.',
        problem: 'The enterprise needed a modern digital presence to establish credibility and attract clients in the competitive real estate market.',
        solution: 'We designed and developed a professional website that communicates trust, showcases property portfolios, and generates leads.',
        features: [
            'Professional business branding',
            'Property portfolio showcase',
            'Service pages',
            'Contact and inquiry forms',
            'Mobile-first design'
        ],
        workflow: 'Visitors can explore the company\'s services, view property listings, and contact the team directly.',
        technology: [
            'HTML5',
            'CSS3',
            'JavaScript',
            'Responsive Design'
        ],
        services: ['Web Design', 'Web Development', 'Brand Identity'],
        outcome: 'A professional digital presence that has enhanced the company\'s credibility and attracted new clients.',
        images: {
            hero: '/images/projects/sassauchi-hero.jpg',
            thumbnail: '/images/portfolio/sassauchi.png',
            gallery: []
        },
        liveUrl: 'https://sassauchienterprises.com',
        githubUrl: null,
        testimonial: null
    },

    {
        id: 'amam-properties',
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
        featuredOrder: 3,
        description: 'A modern real estate website with property showcase and lead generation capabilities.',
        problem: 'AMAM Properties needed a digital platform to showcase their property portfolio and generate qualified leads.',
        solution: 'We built a visually compelling real estate website with property galleries, agent profiles, and integrated lead capture.',
        features: [
            'Property showcase with galleries',
            'Agent profiles',
            'Lead generation forms',
            'Property search',
            'Responsive design'
        ],
        workflow: 'Users can browse properties, view agent details, and submit inquiries through the platform.',
        technology: [
            'HTML5',
            'CSS3',
            'JavaScript',
            'Responsive Design'
        ],
        services: ['Web Design', 'Web Development', 'Lead Generation'],
        outcome: 'An effective digital platform that has increased property inquiries and brand visibility.',
        images: {
            hero: '/images/projects/amam-hero.jpg',
            thumbnail: '/images/portfolio/amam.png',
            gallery: []
        },
        liveUrl: 'https://amampropertiess.com',
        githubUrl: null,
        testimonial: null
    },

    // ============================================
    // YDH PRODUCTS
    // ============================================

    {
        id: 'saraky-data-sub',
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
        featuredOrder: 4,
        description: 'A comprehensive digital services platform offering airtime, data, cable TV, electricity payments, and VTU services.',
        problem: 'Users needed a single platform to access multiple digital services including airtime, data subscriptions, and utility payments.',
        solution: 'We built SARAKY DATA SUB as a unified platform with user accounts, wallets, and integrated payment systems.',
        features: [
            'User accounts and authentication',
            'Digital wallet system',
            'Airtime and data purchases',
            'Cable TV subscriptions',
            'Electricity bill payments',
            'VTU API integration',
            'Transaction history'
        ],
        workflow: 'Users create accounts, fund their wallets, and purchase services instantly. All transactions are tracked in real-time.',
        technology: [
            'PHP',
            'MySQL',
            'Monnify',
            'VTU APIs',
            'HTML5',
            'CSS3',
            'JavaScript'
        ],
        services: ['Product Development', 'UI/UX Design', 'FinTech Solutions'],
        outcome: 'A fully functional digital services platform serving thousands of users with reliable service delivery.',
        images: {
            hero: '/images/projects/saraky-hero.jpg',
            thumbnail: '/images/portfolio/sarakydatasub.png',
            gallery: [
                '/images/projects/saraky-1.jpg',
                '/images/projects/saraky-2.jpg'
            ]
        },
        liveUrl: 'https://sarakydatasub.com',
        githubUrl: null,
        testimonial: null
    },

    {
        id: 'ydh-connect',
        slug: 'ydh-connect',
        title: 'YDH Connect',
        category: 'AI & Automation',
        subcategory: 'Business Automation',
        type: 'YDH Product',
        status: 'In Development',
        year: '2025',
        location: 'Nigeria',
        role: 'Product Development & Architecture',
        featured: true,
        featuredOrder: 5,
        description: 'An AI-powered business communication and automation platform that connects customer interactions to intelligent actions.',
        problem: 'Businesses struggle to manage customer communications across multiple channels and automate responses effectively.',
        solution: 'YDH Connect integrates AI and rules-based automation to handle customer interactions, providing intelligent responses and triggering actions.',
        features: [
            'Multi-channel communication',
            'AI-powered responses',
            'Rules-based automation',
            'Context-aware interactions',
            'Action execution engine',
            'Analytics dashboard'
        ],
        workflow: 'Customer → Communication Channel → YDH Connect → Context → AI/Rules → Tools → Action → Customer',
        technology: [
            'Python',
            'FastAPI',
            'SQLAlchemy',
            'Alembic',
            'SQLite',
            'AI APIs',
            'WhatsApp Integration'
        ],
        services: ['AI Development', 'Business Automation', 'Product Development'],
        outcome: 'A scalable automation platform that helps businesses streamline customer communications.',
        images: {
            hero: '/images/projects/ydh-connect-hero.jpg',
            thumbnail: '/images/projects/ydh-connect-thumb.jpg',
            gallery: []
        },
        liveUrl: null,
        githubUrl: null,
        testimonial: null
    },

    {
        id: 'yukas-ai',
        slug: 'yukas-ai',
        title: 'YUKAS AI',
        category: 'AI',
        subcategory: 'Business Assistant',
        type: 'YDH Product',
        status: 'In Development',
        year: '2025',
        location: 'Nigeria',
        role: 'Product Development',
        featured: true,
        featuredOrder: 6,
        description: 'An AI business assistant designed to help businesses with intelligent insights, automation, and decision support.',
        problem: 'Businesses needed an intelligent assistant to help with data analysis, customer insights, and automated decision-making.',
        solution: 'YUKAS AI is built as an AI assistant layer that provides business intelligence, automation, and decision support.',
        features: [
            'Natural language interface',
            'Business intelligence insights',
            'Automation recommendations',
            'Customer analysis',
            'Integration with YDH Connect'
        ],
        workflow: 'Users interact with YUKAS AI through natural language, receiving insights and recommendations for business decisions.',
        technology: [
            'AI APIs',
            'Python',
            'Natural Language Processing',
            'Business Intelligence'
        ],
        services: ['AI Development', 'Business Intelligence'],
        outcome: 'An intelligent business assistant that helps businesses make data-driven decisions.',
        images: {
            hero: '/images/projects/yukas-ai-hero.jpg',
            thumbnail: '/images/projects/yukas-ai-thumb.jpg',
            gallery: []
        },
        liveUrl: null,
        githubUrl: null,
        testimonial: null
    },

    // ============================================
    // CONCEPT / EXPERIMENTAL
    // ============================================

    {
        id: 'paragon-protocol',
        slug: 'paragon-protocol',
        title: 'Paragon Protocol',
        category: 'Web3',
        subcategory: 'DeFi',
        type: 'Concept / Experimental',
        status: 'Concept',
        year: '2024',
        location: 'Nigeria',
        role: 'UI/UX Design & Product Design',
        featured: false,
        featuredOrder: null,
        description: 'A conceptual Web3 DeFi interface exploring the intersection of decentralized finance and modern user experience design.',
        problem: 'Web3 interfaces often suffer from poor user experience, making DeFi inaccessible to non-technical users.',
        solution: 'Paragon Protocol explores how Web3 DeFi interfaces can be designed with modern UX principles for accessibility and usability.',
        features: [
            'DeFi dashboard design',
            'Liquidity pool visualization',
            'Token swap interface',
            'Portfolio tracking',
            'Modern Web3 UX'
        ],
        workflow: 'Users interact with the DeFi interface to manage assets, provide liquidity, and execute swaps.',
        technology: [
            'React',
            'TypeScript',
            'Web3',
            'Design Systems'
        ],
        services: ['UI/UX Design', 'Product Design', 'Web3'],
        outcome: 'A design exploration that demonstrates how Web3 can be made accessible through great design.',
        images: {
            hero: '/images/projects/paragon-hero.jpg',
            thumbnail: '/images/projects/paragon-thumb.jpg',
            gallery: []
        },
        liveUrl: null,
        githubUrl: null,
        testimonial: null
    }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function getProjectsByType(type) {
    return YDH_PROJECTS.filter(p => p.type === type);
}

function getFeaturedProjects() {
    return YDH_PROJECTS
        .filter(p => p.featured)
        .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));
}

function getProjectBySlug(slug) {
    return YDH_PROJECTS.find(p => p.slug === slug);
}

function getProjectsByCategory(category) {
    return YDH_PROJECTS.filter(p => p.category === category);
}

function getFilterOptions() {
    const types = [...new Set(YDH_PROJECTS.map(p => p.type))];
    const categories = [...new Set(YDH_PROJECTS.map(p => p.category))];
    return { types, categories };
}

function getProjectStatuses() {
    const statuses = [...new Set(YDH_PROJECTS.map(p => p.status))];
    return statuses;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        YDH_PROJECTS,
        getProjectsByType,
        getFeaturedProjects,
        getProjectBySlug,
        getProjectsByCategory,
        getFilterOptions,
        getProjectStatuses
    };
}
