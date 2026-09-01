/* ============================================
   YUKAS DIGITAL HUB — PORTFOLIO CONTROLLER
   Version: 2.0.0
   Handles project filtering, rendering, and interactions
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // PORTFOLIO RENDERER
    // ============================================
    class PortfolioRenderer {
        constructor(options = {}) {
            this.container = options.container || document.getElementById('projectsContainer');
            this.filtersContainer = options.filtersContainer || document.getElementById('projectFilters');
            this.projects = options.projects || window.YDH_PROJECTS || [];
            this.currentFilter = 'All';
            this.isFiltering = false;
            this.init();
        }

        init() {
            if (!this.container) return;

            this.renderFilters();
            this.renderProjects(this.projects);

            // Store reference for global access
            window.YDH = window.YDH || {};
            window.YDH.portfolio = this;
        }

        renderFilters() {
            if (!this.filtersContainer) return;

            const filters = this.getFilterOptions();
            const filterButtons = ['All', ...filters];

            this.filtersContainer.innerHTML = filterButtons.map(filter => `
                <button class="filter-btn ${filter === 'All' ? 'active' : ''}" 
                        data-filter="${filter}"
                        aria-pressed="${filter === 'All' ? 'true' : 'false'}">
                    ${filter}
                </button>
            `).join('');

            // Add event listeners
            this.filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.setFilter(btn.dataset.filter);
                });
            });
        }

        getFilterOptions() {
            const types = new Set(this.projects.map(p => p.type));
            return Array.from(types);
        }

        setFilter(filter) {
            if (this.currentFilter === filter && !this.isFiltering) return;
            this.currentFilter = filter;

            // Update button states
            this.filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
                const isActive = btn.dataset.filter === filter;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });

            this.filterProjects(filter);
        }

        filterProjects(filter) {
            this.isFiltering = true;

            const items = this.container.querySelectorAll('.project-grid-item');
            const filtered = filter === 'All' 
                ? this.projects 
                : this.projects.filter(p => p.type === filter);

            // Hide all first
            items.forEach(item => {
                item.classList.add('filtering-out');
                item.classList.remove('filtering-in');
            });

            setTimeout(() => {
                items.forEach(item => {
                    item.classList.add('hidden');
                    item.classList.remove('filtering-out');
                });

                // Show filtered items
                const filteredIds = new Set(filtered.map(p => p.id));
                items.forEach(item => {
                    const id = item.dataset.projectId;
                    if (filteredIds.has(id)) {
                        item.classList.remove('hidden');
                        item.classList.add('filtering-in');
                    }
                });

                setTimeout(() => {
                    items.forEach(item => {
                        item.classList.remove('filtering-in');
                    });
                    this.isFiltering = false;
                }, 300);
            }, 300);
        }

        renderProjects(projects) {
            if (!this.container) return;

            this.container.innerHTML = projects.map(project => `
                <div class="project-grid-item" data-project-id="${project.id}">
                    <div class="project-card" data-project="${project.slug}">
                        <div class="project-card-image">
                            <img src="${project.images.thumbnail || '/images/placeholder-project.jpg'}" 
                                 alt="${project.title}" 
                                 loading="lazy"
                                 onerror="this.style.display='none'; this.parentElement.innerHTML += '<div style=\'display:flex;align-items:center;justify-content:center;height:100%;color:rgba(255,255,255,0.1);font-size:3rem;\'><i class=\'fas fa-cube\'></i></div>'">
                            <span class="project-type-badge ${this.getTypeClass(project.type)}">${project.type}</span>
                            <span class="project-status-badge ${this.getStatusClass(project.status)}">${project.status}</span>
                        </div>
                        <div class="project-card-info">
                            <div class="project-category">${project.category} • ${project.subcategory}</div>
                            <h3>${project.title}</h3>
                            <p class="project-description">${project.description}</p>
                            <div class="project-tech">
                                ${project.technology.slice(0, 4).map(tech => `<span>${tech}</span>`).join('')}
                                ${project.technology.length > 4 ? `<span>+${project.technology.length - 4} more</span>` : ''}
                            </div>
                            <div class="project-card-actions">
                                ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="btn btn-outline btn-small">Visit <i class="fas fa-arrow-right"></i></a>` : ''}
                                <a href="/pages/case-study.html?project=${project.slug}" class="btn btn-primary btn-small">View Case Study <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add click handler for card navigation
            this.container.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    // Don't navigate if clicking a link or button
                    if (e.target.closest('a') || e.target.closest('.btn')) return;
                    const slug = card.dataset.project;
                    if (slug) {
                        window.location.href = `/pages/case-study.html?project=${slug}`;
                    }
                });
            });
        }

        getTypeClass(type) {
            const map = {
                'Client Project': 'client',
                'YDH Product': 'product',
                'Concept / Experimental': 'concept'
            };
            return map[type] || 'concept';
        }

        getStatusClass(status) {
            const map = {
                'Launched': 'launched',
                'In Development': 'development',
                'Concept': 'concept'
            };
            return map[status] || 'concept';
        }

        refresh() {
            // Re-render with current projects
            this.renderProjects(this.projects);
            this.renderFilters();
        }
    }

    // ============================================
    // CASE STUDY RENDERER
    // ============================================
    class CaseStudyRenderer {
        constructor() {
            this.projectSlug = this.getProjectSlug();
            this.project = this.projectSlug ? this.getProject(this.projectSlug) : null;
            this.container = document.getElementById('caseStudyContainer');
            this.init();
        }

        getProjectSlug() {
            const params = new URLSearchParams(window.location.search);
            return params.get('project');
        }

        getProject(slug) {
            if (typeof window.YDH_PROJECTS === 'undefined') {
                console.error('YDH_PROJECTS not loaded');
                return null;
            }
            return window.YDH_PROJECTS.find(p => p.slug === slug) || null;
        }

        init() {
            if (!this.container) return;

            if (!this.project) {
                this.renderNotFound();
                return;
            }

            this.renderCaseStudy(this.project);

            // Update page title and meta
            document.title = `${this.project.title} — YUKAS DIGITAL HUB Case Study`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.content = this.project.description;
            }
        }

        renderCaseStudy(project) {
            this.container.innerHTML = `
                <!-- Hero -->
                <section class="case-study-hero">
                    <div class="container">
                        <div class="case-study-breadcrumb">
                            <a href="/pages/portfolio.html">← Back to Portfolio</a>
                        </div>
                        <h1>${project.title}</h1>
                        <p style="color: rgba(255,255,255,0.7); max-width: 600px; font-size: 1.1rem;">
                            ${project.description}
                        </p>
                        <div class="case-study-meta">
                            <div class="case-study-meta-item">
                                <span class="label">Category</span>
                                <span class="value">${project.category}</span>
                            </div>
                            <div class="case-study-meta-item">
                                <span class="label">Type</span>
                                <span class="value">${project.type}</span>
                            </div>
                            <div class="case-study-meta-item">
                                <span class="label">Status</span>
                                <span class="value">${project.status}</span>
                            </div>
                            <div class="case-study-meta-item">
                                <span class="label">Year</span>
                                <span class="value">${project.year}</span>
                            </div>
                            ${project.location ? `
                            <div class="case-study-meta-item">
                                <span class="label">Location</span>
                                <span class="value">${project.location}</span>
                            </div>
                            ` : ''}
                            <div class="case-study-meta-item">
                                <span class="label">Role</span>
                                <span class="value">${project.role}</span>
                            </div>
                        </div>
                        ${project.liveUrl ? `
                        <a href="${project.liveUrl}" target="_blank" class="btn btn-primary btn-large">
                            Visit Live Project <i class="fas fa-arrow-right"></i>
                        </a>
                        ` : ''}
                    </div>
                </section>

                <!-- Overview -->
                <section class="case-study-section">
                    <div class="container">
                        <div class="section-label">Overview</div>
                        <div class="content">
                            <h2>Project Overview</h2>
                            <p>${project.description}</p>
                        </div>
                    </div>
                </section>

                <!-- Challenge -->
                <section class="case-study-section">
                    <div class="container">
                        <div class="section-label">Challenge</div>
                        <div class="content">
                            <h2>The Challenge</h2>
                            <p>${project.problem}</p>
                        </div>
                    </div>
                </section>

                <!-- Solution -->
                <section class="case-study-section">
                    <div class="container">
                        <div class="section-label">Solution</div>
                        <div class="content">
                            <h2>The Solution</h2>
                            <p>${project.solution}</p>
                        </div>
                    </div>
                </section>

                <!-- Features -->
                <section class="case-study-section">
                    <div class="container">
                        <div class="section-label">Features</div>
                        <div class="content">
                            <h2>Key Features</h2>
                            <p>Here are the key features that make ${project.title} stand out.</p>
                            <div class="features-list">
                                ${project.features.map(f => `
                                    <div class="features-list-item">
                                        <i class="fas fa-check-circle"></i>
                                        <span>${f}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Workflow -->
                ${project.workflow ? `
                <section class="case-study-section">
                    <div class="container">
                        <div class="section-label">Workflow</div>
                        <div class="content">
                            <h2>User Experience / Workflow</h2>
                            <p>${project.workflow}</p>
                        </div>
                    </div>
                </section>
                ` : ''}

                <!-- Technology -->
                <section class="case-study-section">
                    <div class="container">
                        <div class="section-label">Technology</div>
                        <div class="content">
                            <h2>Technology Stack</h2>
                            <p>The following technologies were used to build ${project.title}.</p>
                            <div class="tech-stack">
                                ${project.technology.map(tech => `
                                    <span class="tech-stack-item">${tech}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Services -->
                <section class="case-study-section">
                    <div class="container">
                        <div class="section-label">Services</div>
                        <div class="content">
                            <h2>YDH Role</h2>
                            <p>YUKAS DIGITAL HUB provided the following services for this project.</p>
                            <div class="tech-stack">
                                ${project.services.map(service => `
                                    <span class="tech-stack-item" style="border-color: rgba(37, 99, 235, 0.15); color: var(--ydh-blue-400);">
                                        ${service}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Outcome -->
                <section class="case-study-section">
                    <div class="container">
                        <div class="section-label">Outcome</div>
                        <div class="content">
                            <h2>Outcome</h2>
                            <p>${project.outcome}</p>
                            <div class="outcome-grid">
                                <div class="outcome-card">
                                    <span class="number">✓</span>
                                    <span class="label">Project Delivered</span>
                                </div>
                                <div class="outcome-card">
                                    <span class="number">🚀</span>
                                    <span class="label">${project.status === 'Launched' ? 'Live & Operational' : 'In Development'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Next Project -->
                <section class="next-project">
                    <div class="container">
                        <div class="next-label">Next Project</div>
                        <h3>Explore More Work</h3>
                        <a href="/pages/portfolio.html" class="btn btn-outline btn-large">
                            View All Projects <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </section>
            `;
        }

        renderNotFound() {
            this.container.innerHTML = `
                <section class="case-study-hero" style="min-height: 60vh; display: flex; align-items: center; text-align: center;">
                    <div class="container">
                        <h1>Project Not Found</h1>
                        <p style="color: rgba(255,255,255,0.6); margin-bottom: var(--ydh-space-6);">
                            The case study you're looking for doesn't exist.
                        </p>
                        <a href="/pages/portfolio.html" class="btn btn-primary">
                            Back to Portfolio <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </section>
            `;
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        // Check if we're on a page with projects container
        const projectsContainer = document.getElementById('projectsContainer');
        const filtersContainer = document.getElementById('projectFilters');

        if (projectsContainer) {
            // Load projects data
            if (typeof window.YDH_PROJECTS === 'undefined') {
                // If data not loaded, fetch it
                fetch('/data/projects.js')
                    .then(response => response.text())
                    .then(data => {
                        // Execute the data script
                        eval(data);
                        new PortfolioRenderer({
                            container: projectsContainer,
                            filtersContainer: filtersContainer,
                            projects: window.YDH_PROJECTS
                        });
                    })
                    .catch(() => {
                        console.error('Failed to load project data');
                    });
            } else {
                new PortfolioRenderer({
                    container: projectsContainer,
                    filtersContainer: filtersContainer,
                    projects: window.YDH_PROJECTS
                });
            }
        }

        // Check if we're on a case study page
        const caseStudyContainer = document.getElementById('caseStudyContainer');
        if (caseStudyContainer) {
            // Make sure projects data is loaded
            if (typeof window.YDH_PROJECTS === 'undefined') {
                fetch('/data/projects.js')
                    .then(response => response.text())
                    .then(data => {
                        eval(data);
                        new CaseStudyRenderer();
                    })
                    .catch(() => {
                        console.error('Failed to load project data for case study');
                    });
            } else {
                new CaseStudyRenderer();
            }
        }
    });

    // ============================================
    // EXPOSE FOR GLOBAL USE
    // ============================================
    window.YDH = window.YDH || {};
    window.YDH.portfolio = {
        renderer: null,
        caseStudy: null
    };

})();
