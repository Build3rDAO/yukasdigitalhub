/**
 * ============================================================
 * YUKAS DIGITAL HUB — Motion System
 * ============================================================
 * Version: 2.0.0
 * ============================================================
 */

(function() {
    'use strict';

    // ============================================================
    // 01 — AI WORKFLOW ANIMATION
    // ============================================================

    function initAIWorkflow() {
        const container = document.getElementById('ai-workflow');
        if (!container) return;

        const steps = container.querySelectorAll('.workflow-step');
        const connections = container.querySelectorAll('.workflow-connection');
        
        let isAnimating = false;
        let currentStep = 0;

        function animateStep(index) {
            if (index >= steps.length) {
                // Reset after a delay
                setTimeout(function() {
                    steps.forEach(function(step) {
                        step.classList.remove('active', 'completed');
                    });
                    connections.forEach(function(conn) {
                        conn.classList.remove('active');
                    });
                    currentStep = 0;
                    isAnimating = false;
                }, 2000);
                return;
            }

            const step = steps[index];
            step.classList.add('active');
            
            // Animate connection
            if (index > 0) {
                const conn = connections[index - 1];
                if (conn) {
                    conn.classList.add('active');
                }
            }

            // Move to next step after delay
            setTimeout(function() {
                step.classList.remove('active');
                step.classList.add('completed');
                currentStep = index + 1;
                animateStep(currentStep);
            }, 800);
        }

        // Start animation on scroll
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !isAnimating) {
                    isAnimating = true;
                    // Reset all
                    steps.forEach(function(step) {
                        step.classList.remove('active', 'completed');
                    });
                    connections.forEach(function(conn) {
                        conn.classList.remove('active');
                    });
                    currentStep = 0;
                    // Start after a small delay
                    setTimeout(function() {
                        animateStep(0);
                    }, 500);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(container);
    }

    // ============================================================
    // 02 — HERO ANIMATION
    // ============================================================

    function initHeroAnimation() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const content = hero.querySelector('.hero-content');
        const visual = hero.querySelector('.hero-visual');

        if (content) {
            content.classList.add('animate-fade-in-blur');
            content.style.animationDelay = '200ms';
        }

        if (visual) {
            visual.classList.add('animate-fade-in-blur');
            visual.style.animationDelay = '400ms';
        }
    }

    // ============================================================
    // 03 — COUNTER ANIMATION
    // ============================================================

    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(function(counter) {
            const target = parseInt(counter.dataset.target);
            if (isNaN(target)) return;
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting && !counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter, target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }

    function animateCounter(element, target) {
        let current = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';

        function updateCounter() {
            current += increment;
            if (current < target) {
                element.textContent = prefix + Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = prefix + target + suffix;
            }
        }

        updateCounter();
    }

    // ============================================================
    // 04 — INITIALIZE
    // ============================================================

    function init() {
        initAIWorkflow();
        initHeroAnimation();
        initCounters();

        console.log('✅ YUKAS DIGITAL HUB — Motion loaded (v2.0.0)');
    }

    // Wait for DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
