/* ============================================
   YUKAS DIGITAL HUB — MOTION CONTROLLER
   Version: 2.0.0
   Handles scroll reveals, animations, and interactions
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        SCROLL_THRESHOLD: 0.08,
        STAGGER_DELAY: 80,
        REDUCED_MOTION_CHECK: window.matchMedia('(prefers-reduced-motion: reduce)'),
        IS_TOUCH_DEVICE: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    };

    // ============================================
    // SCROLL REVEAL — Intersection Observer
    // ============================================
    class ScrollReveal {
        constructor() {
            this.observer = null;
            this.init();
        }

        init() {
            // Skip if reduced motion is preferred
            if (CONFIG.REDUCED_MOTION_CHECK.matches) {
                this.revealAllImmediately();
                return;
            }

            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            this.revealElement(entry.target);
                            this.observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: CONFIG.SCROLL_THRESHOLD,
                    rootMargin: '0px 0px -50px 0px',
                }
            );

            this.observeElements();
        }

        observeElements() {
            // Elements with .reveal class
            document.querySelectorAll('.reveal').forEach((el) => {
                this.observer.observe(el);
            });

            // Elements with .reveal-stagger class
            document.querySelectorAll('.reveal-stagger').forEach((el) => {
                this.observer.observe(el);
            });

            // Elements with .animate-on-scroll class (legacy support)
            document.querySelectorAll('.animate-on-scroll').forEach((el) => {
                this.observer.observe(el);
            });
        }

        revealElement(element) {
            // Handle stagger containers
            if (element.classList.contains('reveal-stagger')) {
                element.classList.add('visible');
                const children = element.children;
                Array.from(children).forEach((child, index) => {
                    child.style.transitionDelay = `${index * CONFIG.STAGGER_DELAY}ms`;
                });
                return;
            }

            // Handle regular reveal
            element.classList.add('visible');

            // Trigger any animation classes
            if (element.dataset.animation) {
                element.classList.add(element.dataset.animation);
            }
        }

        revealAllImmediately() {
            // When reduced motion is preferred, show everything immediately
            document.querySelectorAll('.reveal, .reveal-stagger, .animate-on-scroll').forEach((el) => {
                el.classList.add('visible');
                if (el.classList.contains('reveal-stagger')) {
                    Array.from(el.children).forEach((child) => {
                        child.style.opacity = '1';
                        child.style.transform = 'none';
                    });
                }
            });
        }

        // Re-observe after dynamic content loads
        refresh() {
            if (this.observer) {
                this.observeElements();
            }
        }
    }

    // ============================================
    // HERO ENTRANCE ANIMATION
    // ============================================
    class HeroEntrance {
        constructor() {
            this.init();
        }

        init() {
            if (CONFIG.REDUCED_MOTION_CHECK.matches) {
                this.showAllImmediately();
                return;
            }

            const elements = document.querySelectorAll('.hero-entrance');
            elements.forEach((el, index) => {
                // The class already has animation, just ensure it's visible
                if (el.classList.contains('hero-entrance-1') ||
                    el.classList.contains('hero-entrance-2') ||
                    el.classList.contains('hero-entrance-3') ||
                    el.classList.contains('hero-entrance-4') ||
                    el.classList.contains('hero-entrance-5')) {
                    // Already has animation
                } else {
                    // Fallback: add animation class
                    const delay = index * 200;
                    el.style.opacity = '0';
                    el.style.animation = `fadeUp 0.7s ease-out ${delay}ms forwards`;
                }
            });
        }

        showAllImmediately() {
            document.querySelectorAll('.hero-entrance').forEach((el) => {
                el.style.opacity = '1';
                el.style.animation = 'none';
            });
        }
    }

    // ============================================
    // AI WORKFLOW ANIMATION
    // ============================================
    class AIWorkflowAnimation {
        constructor() {
            this.workflows = [];
            this.init();
        }

        init() {
            if (CONFIG.REDUCED_MOTION_CHECK.matches) {
                this.showAllCompleted();
                return;
            }

            // Find all workflow containers
            document.querySelectorAll('.ai-workflow').forEach((container) => {
                const workflow = {
                    container: container,
                    nodes: container.querySelectorAll('.flow-node'),
                    lines: container.querySelectorAll('.flow-line'),
                    observer: null,
                    activated: false,
                };

                // Setup intersection observer for each workflow
                workflow.observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting && !workflow.activated) {
                                this.activateWorkflow(workflow);
                                workflow.observer.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.3 }
                );

                workflow.observer.observe(container);
                this.workflows.push(workflow);
            });
        }

        activateWorkflow(workflow) {
            workflow.activated = true;
            const { nodes, lines } = workflow;

            // Activate nodes sequentially
            nodes.forEach((node, index) => {
                const delay = index * 400;
                setTimeout(() => {
                    node.classList.add('active');
                }, delay);

                // Complete node after animation
                setTimeout(() => {
                    node.classList.remove('active');
                    node.classList.add('completed');
                }, delay + 600);
            });

            // Activate lines sequentially
            lines.forEach((line, index) => {
                const delay = index * 400 + 200;
                setTimeout(() => {
                    line.classList.add('active');
                }, delay);

                setTimeout(() => {
                    line.classList.remove('active');
                    line.classList.add('completed');
                }, delay + 600);
            });

            // Show completion state
            const totalNodes = nodes.length;
            const totalDelay = totalNodes * 400 + 800;
            setTimeout(() => {
                const completionEl = workflow.container.querySelector('.flow-completion');
                if (completionEl) {
                    completionEl.classList.add('visible');
                }
            }, totalDelay);
        }

        showAllCompleted() {
            this.workflows.forEach((workflow) => {
                workflow.nodes.forEach((node) => {
                    node.classList.add('completed');
                    node.classList.remove('active');
                });
                workflow.lines.forEach((line) => {
                    line.classList.add('completed');
                    line.classList.remove('active');
                });
                const completionEl = workflow.container.querySelector('.flow-completion');
                if (completionEl) {
                    completionEl.classList.add('visible');
                }
            });
        }
    }

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    class CounterAnimation {
        constructor() {
            this.counters = [];
            this.init();
        }

        init() {
            if (CONFIG.REDUCED_MOTION_CHECK.matches) {
                this.setAllCounters();
                return;
            }

            document.querySelectorAll('[data-counter]').forEach((el) => {
                const target = parseInt(el.dataset.counter);
                if (isNaN(target)) return;

                const counter = {
                    element: el,
                    target: target,
                    current: 0,
                    duration: parseInt(el.dataset.duration) || 2000,
                    observer: null,
                    animated: false,
                };

                counter.observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting && !counter.animated) {
                                this.animateCounter(counter);
                                counter.observer.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.5 }
                );

                counter.observer.observe(el);
                this.counters.push(counter);
            });
        }

        animateCounter(counter) {
            counter.animated = true;
            const { element, target, duration } = counter;
            const startTime = performance.now();
            const suffix = element.dataset.suffix || '';
            const prefix = element.dataset.prefix || '';

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    element.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
                    element.classList.add('count-complete');
                }
            };

            requestAnimationFrame(update);
        }

        setAllCounters() {
            document.querySelectorAll('[data-counter]').forEach((el) => {
                const target = parseInt(el.dataset.counter);
                const suffix = el.dataset.suffix || '';
                const prefix = el.dataset.prefix || '';
                el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
                el.classList.add('count-complete');
            });
        }
    }

    // ============================================
    // BUTTON RIPPLE EFFECT
    // ============================================
    class ButtonRipple {
        constructor() {
            this.init();
        }

        init() {
            if (CONFIG.IS_TOUCH_DEVICE) return;

            document.querySelectorAll('.btn-ripple').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    this.createRipple(e, btn);
                });
            });
        }

        createRipple(e, btn) {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            btn.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    }

    // ============================================
    // PARALLAX (Subtle)
    // ============================================
    class ParallaxEffect {
        constructor() {
            this.elements = [];
            this.init();
        }

        init() {
            if (CONFIG.REDUCED_MOTION_CHECK.matches || CONFIG.IS_TOUCH_DEVICE) return;

            document.querySelectorAll('[data-parallax]').forEach((el) => {
                const speed = parseFloat(el.dataset.parallax) || 0.05;
                this.elements.push({ element: el, speed: speed });
            });

            if (this.elements.length > 0) {
                this.bindScroll();
            }
        }

        bindScroll() {
            let ticking = false;

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.update();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }

        update() {
            const scrollY = window.scrollY;
            this.elements.forEach(({ element, speed }) => {
                const rect = element.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const offset = (centerY - viewportCenter) * speed;
                const maxOffset = 40;
                const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, -offset));

                element.style.transform = `translateY(${clampedOffset}px)`;
            });
        }

        refresh() {
            // Re-initialize for dynamic content
            this.elements = [];
            this.init();
        }
    }

    // ============================================
    // SMOOTH SCROLL (for anchor links)
    // ============================================
    class SmoothScroll {
        constructor() {
            this.init();
        }

        init() {
            if (CONFIG.REDUCED_MOTION_CHECK.matches) return;

            document.querySelectorAll('a[href^="#"]').forEach((link) => {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href');
                    if (targetId === '#') return;

                    const target = document.querySelector(targetId);
                    if (!target) return;

                    e.preventDefault();
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth',
                    });
                });
            });
        }
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    class NavbarScroll {
        constructor() {
            this.navbar = document.querySelector('.navbar');
            this.scrollThreshold = 50;
            this.init();
        }

        init() {
            if (!this.navbar) return;

            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                if (scrollY > this.scrollThreshold) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            }, { passive: true });
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for fonts and layout to stabilize
        requestAnimationFrame(() => {
            const reveal = new ScrollReveal();
            const hero = new HeroEntrance();
            const workflow = new AIWorkflowAnimation();
            const counters = new CounterAnimation();
            const ripples = new ButtonRipple();
            const parallax = new ParallaxEffect();
            const smoothScroll = new SmoothScroll();
            const navbar = new NavbarScroll();

            // Store instances for debugging/refresh
            window.YDH = window.YDH || {};
            window.YDH.motion = {
                reveal,
                workflow,
                counters,
                parallax,
            };
        });
    });

    // ============================================
    // REFRESH — For dynamically loaded content
    // ============================================
    window.YDH = window.YDH || {};
    window.YDH.refreshMotion = function() {
        if (window.YDH.motion) {
            if (window.YDH.motion.reveal) {
                window.YDH.motion.reveal.refresh();
            }
            if (window.YDH.motion.parallax) {
                window.YDH.motion.parallax.refresh();
            }
        }
    };

})();
