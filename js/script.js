/**
 * YUKAS DIGITAL HUB - Main JavaScript
 * Features: Mobile Menu, Sticky Navbar, Scroll Reveal, Form Validation, Smooth Scroll, Active Links
 * Version: 2.0.0
 * Author: YUKAS DIGITAL HUB
 */

// ============================================
// IIFE - Avoid Global Namespace Pollution
// ============================================
(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        SCROLL_THRESHOLD: 50,
        MOBILE_BREAKPOINT: 768,
        SCROLL_HIDE_THRESHOLD: 100,
        REVEAL_THRESHOLD: 0.1,
        REVEAL_MARGIN: '0px 0px -50px 0px',
        FORM_SUCCESS_DURATION: 5000,
        SCROLL_TOP_THRESHOLD: 500,
        DEBOUNCE_DELAY: 100,
        THROTTLE_DELAY: 100
    };

    // DOM Elements cache
    const DOM = {};

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    /**
     * Debounce function for performance optimization
     */
    function debounce(func, delay = CONFIG.DEBOUNCE_DELAY) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Throttle function for scroll events
     */
    function throttle(func, limit = CONFIG.THROTTLE_DELAY) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Safe DOM element getter with error handling
     */
    function getElement(id, context = document) {
        const element = context.getElementById(id);
        if (!element) {
            console.warn(`Element with id "${id}" not found`);
        }
        return element;
    }

    /**
     * Add CSS class safely
     */
    function addClass(element, className) {
        if (element && !element.classList.contains(className)) {
            element.classList.add(className);
        }
    }

    /**
     * Remove CSS class safely
     */
    function removeClass(element, className) {
        if (element && element.classList.contains(className)) {
            element.classList.remove(className);
        }
    }

    /**
     * Toggle body scroll
     */
    function toggleBodyScroll(disable) {
        DOM.body.style.overflow = disable ? 'hidden' : '';
    }

    // ============================================
    // CACHE DOM ELEMENTS
    // ============================================
    function cacheDOM() {
        DOM.hamburger = getElement('hamburger');
        DOM.navLinks = getElement('navLinks');
        DOM.body = document.body;
        DOM.navbar = getElement('navbar');
        DOM.contactForm = getElement('contactForm');
        DOM.revealElements = document.querySelectorAll('.animate-on-scroll');
        DOM.cards = document.querySelectorAll('.service-card, .feature, .pricing-card');
        DOM.buttons = document.querySelectorAll('.btn');
        DOM.allForms = document.querySelectorAll('form');
        DOM.lazyImages = document.querySelectorAll('img[data-src]');
        DOM.smoothLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    }

    // ============================================
    // MOBILE MENU TOGGLE (Enhanced)
    // ============================================
    function initMobileMenu() {
        if (!DOM.hamburger || !DOM.navLinks) return;

        const updateIcon = (isOpen) => {
            const icon = DOM.hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', !isOpen);
                icon.classList.toggle('fa-times', isOpen);
            }
        };

        const closeMenu = () => {
            removeClass(DOM.navLinks, 'active');
            removeClass(DOM.hamburger, 'active');
            updateIcon(false);
            toggleBodyScroll(false);
        };

        const openMenu = () => {
            addClass(DOM.navLinks, 'active');
            addClass(DOM.hamburger, 'active');
            updateIcon(true);
            toggleBodyScroll(true);
        };

        // Toggle menu on hamburger click
        DOM.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (DOM.navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu on link click
        const navItems = DOM.navLinks.querySelectorAll('a');
        navItems.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on outside click
        document.addEventListener('click', (event) => {
            if (DOM.navLinks.classList.contains('active') && 
                !DOM.navLinks.contains(event.target) && 
                !DOM.hamburger.contains(event.target)) {
                closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > CONFIG.MOBILE_BREAKPOINT && DOM.navLinks.classList.contains('active')) {
                closeMenu();
            }
        }));
    }

    // ============================================
    // STICKY NAVBAR WITH SMART HIDE/SHOW
    // ============================================
    function initStickyNavbar() {
        if (!DOM.navbar) return;
        
        let lastScrollTop = 0;
        
        const handleScroll = throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class
            if (scrollTop > CONFIG.SCROLL_THRESHOLD) {
                addClass(DOM.navbar, 'scrolled');
            } else {
                removeClass(DOM.navbar, 'scrolled');
            }
            
            // Smart hide/show on mobile
            if (window.innerWidth <= CONFIG.MOBILE_BREAKPOINT) {
                if (scrollTop > lastScrollTop && scrollTop > CONFIG.SCROLL_HIDE_THRESHOLD) {
                    DOM.navbar.style.transform = 'translateY(-100%)';
                } else {
                    DOM.navbar.style.transform = 'translateY(0)';
                }
            }
            lastScrollTop = scrollTop;
        });
        
        window.addEventListener('scroll', handleScroll);
    }

    // ============================================
    // SCROLL REVEAL ANIMATION (Enhanced)
    // ============================================
    function initScrollReveal() {
        if (!DOM.revealElements.length) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    addClass(entry.target, 'visible');
                    revealObserver.unobserve(entry.target); // Unobserve after reveal
                }
            });
        }, {
            threshold: CONFIG.REVEAL_THRESHOLD,
            rootMargin: CONFIG.REVEAL_MARGIN
        });
        
        DOM.revealElements.forEach(element => {
            revealObserver.observe(element);
        });
        
        // Fallback for older browsers
        if (!window.IntersectionObserver) {
            const checkVisibility = () => {
                DOM.revealElements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    if (rect.top < window.innerHeight - 100) {
                        addClass(element, 'visible');
                    }
                });
            };
            window.addEventListener('scroll', throttle(checkVisibility));
            window.addEventListener('resize', debounce(checkVisibility));
            checkVisibility();
        }
    }

    // ============================================
    // SMOOTH SCROLLING (Enhanced with offset)
    // ============================================
    function initSmoothScroll() {
        DOM.smoothLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = DOM.navbar?.offsetHeight || 80;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // ============================================
    // ACTIVE NAVIGATION LINK (Improved)
    // ============================================
    function initActiveLinks() {
        const setActiveLink = () => {
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split('/').pop() || 'index.html';
            const links = document.querySelectorAll('.nav-links a');
            
            links.forEach(link => {
                const linkPath = link.getAttribute('href');
                let isActive = false;
                
                if (linkPath === currentPage || linkPath === currentPath) {
                    isActive = true;
                } else if (currentPage === 'index.html' && linkPath === 'index.html') {
                    isActive = true;
                } else if (currentPage === '' && linkPath === 'index.html') {
                    isActive = true;
                } else if (linkPath?.includes(currentPage.split('.')[0]) && currentPage !== 'index.html') {
                    isActive = true;
                }
                
                if (isActive) {
                    addClass(link, 'active');
                } else {
                    removeClass(link, 'active');
                }
            });
        };
        
        setActiveLink();
        window.addEventListener('popstate', setActiveLink);
    }

    // ============================================
    // FORM VALIDATION (Enhanced with better UX)
    // ============================================
    function initFormValidation() {
        if (!DOM.contactForm) return;

        const errorMessages = new Map();

        const showError = (input, message) => {
            if (!input) return;
            
            addClass(input, 'error');
            input.style.borderColor = '#ff4444';
            
            let errorElement = input.parentElement?.querySelector('.error-message');
            if (!errorElement && input.parentElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                input.parentElement.appendChild(errorElement);
                errorMessages.set(input, errorElement);
            }
            
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.cssText = 'color: #ff4444; font-size: 0.75rem; margin-top: 0.25rem; animation: fadeInUp 0.3s ease;';
            }
        };

        const clearError = (input) => {
            if (!input) return;
            
            removeClass(input, 'error');
            input.style.borderColor = '';
            
            const errorElement = errorMessages.get(input);
            if (errorElement) {
                errorElement.remove();
                errorMessages.delete(input);
            }
        };

        const clearAllErrors = () => {
            errorMessages.forEach((error, input) => {
                removeClass(input, 'error');
                input.style.borderColor = '';
                error.remove();
            });
            errorMessages.clear();
        };

        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
            return emailRegex.test(email);
        };

        const showFormSuccess = () => {
            let successMessage = document.querySelector('.form-success');
            if (successMessage) successMessage.remove();
            
            successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <strong>Message sent successfully!</strong>
                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
            `;
            successMessage.style.cssText = `
                background: linear-gradient(135deg, #d4edda, #c3e6cb);
                color: #155724;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                margin-top: 1rem;
                border: 1px solid #c3e6cb;
                animation: slideInUp 0.4s ease;
                display: flex;
                align-items: center;
                gap: 1rem;
            `;
            
            DOM.contactForm.parentElement?.appendChild(successMessage);
            
            setTimeout(() => {
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(-10px)';
                setTimeout(() => successMessage.remove(), 300);
            }, CONFIG.FORM_SUCCESS_DURATION);
        };

        const validateForm = () => {
            const nameInput = getElement('name');
            const emailInput = getElement('email');
            const messageInput = getElement('message');
            let isValid = true;
            
            clearAllErrors();
            
            // Name validation
            if (!nameInput || !nameInput.value.trim()) {
                showError(nameInput, 'Please enter your full name');
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                showError(nameInput, 'Name must be at least 2 characters');
                isValid = false;
            }
            
            // Email validation
            if (!emailInput || !emailInput.value.trim()) {
                showError(emailInput, 'Please enter your email address');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address (e.g., name@example.com)');
                isValid = false;
            }
            
            // Message validation
            if (!messageInput || !messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                showError(messageInput, 'Message must be at least 10 characters');
                isValid = false;
            }
            
            return isValid;
        };

        // Real-time validation
        const formInputs = DOM.contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => clearError(input));
            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    showError(input, `${input.placeholder || 'This field'} is required`);
                }
            });
        });

        // Form submission
        let isSubmitting = false;
        DOM.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (isSubmitting) return;
            
            if (validateForm()) {
                isSubmitting = true;
                
                // Simulate form submission (replace with actual API call)
                try {
                    // await submitFormData(); // Uncomment when backend is ready
                    showFormSuccess();
                    DOM.contactForm.reset();
                } catch (error) {
                    console.error('Form submission error:', error);
                    alert('An error occurred. Please try again later.');
                } finally {
                    setTimeout(() => { isSubmitting = false; }, 3000);
                }
            }
        });
    }

    // ============================================
    // SCROLL TO TOP BUTTON (Enhanced)
    // ============================================
    function initScrollToTop() {
        if (document.querySelector('.scroll-top')) return;
        
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6C63FF, #4A3BFF);
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 99;
            box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
            font-size: 1.25rem;
        `;
        
        document.body.appendChild(scrollBtn);
        
        const toggleButton = throttle(() => {
            const shouldShow = window.scrollY > CONFIG.SCROLL_TOP_THRESHOLD;
            scrollBtn.style.opacity = shouldShow ? '1' : '0';
            scrollBtn.style.visibility = shouldShow ? 'visible' : 'hidden';
        });
        
        window.addEventListener('scroll', toggleButton);
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        scrollBtn.addEventListener('mouseenter', () => {
            scrollBtn.style.transform = 'translateY(-3px)';
            scrollBtn.style.boxShadow = '0 6px 20px rgba(108, 99, 255, 0.4)';
        });
        
        scrollBtn.addEventListener('mouseleave', () => {
            scrollBtn.style.transform = 'translateY(0)';
            scrollBtn.style.boxShadow = '0 4px 12px rgba(108, 99, 255, 0.3)';
        });
    }

    // ============================================
    // CARD HOVER EFFECTS (Optimized with CSS)
    // ============================================
    function initCardEffects() {
        DOM.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    // ============================================
    // RIPPLE EFFECT FOR BUTTONS (Optimized)
    // ============================================
    function initRippleEffect() {
        DOM.buttons.forEach(button => {
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.className = 'ripple';
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // ============================================
    // IMAGE LAZY LOADING (Performance)
    // ============================================
    function initLazyLoading() {
        if (!DOM.lazyImages.length) return;
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            DOM.lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            DOM.lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ============================================
    // PREVENT DOUBLE FORM SUBMISSION
    // ============================================
    function initPreventDoubleSubmission() {
        DOM.allForms.forEach(form => {
            let submitted = false;
            form.addEventListener('submit', (e) => {
                if (submitted) {
                    e.preventDefault();
                    return false;
                }
                submitted = true;
                setTimeout(() => { submitted = false; }, 3000);
            });
        });
    }

    // ============================================
    // ADD DYNAMIC STYLES
    // ============================================
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(40px);
                transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                            transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .animate-on-scroll.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .navbar {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                            box-shadow 0.3s ease, 
                            background 0.3s ease;
            }
            
            .error-message {
                animation: fadeInUp 0.3s ease;
            }
            
            .form-success {
                animation: slideInUp 0.4s ease;
            }
            
            /* Reduced motion preference */
            @media (prefers-reduced-motion: reduce) {
                .animate-on-scroll,
                .navbar,
                .btn,
                .service-card,
                .feature {
                    transition: none !important;
                    animation: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // ADD PERFORMANCE METRICS (Optional)
    // ============================================
    function logPerformanceMetrics() {
        if (process.env.NODE_ENV === 'development') {
            console.log('%c🚀 YUKAS DIGITAL HUB | Premium Digital Agency', 'color: #6C63FF; font-size: 16px; font-weight: bold;');
            console.log('%c✓ Website loaded successfully', 'color: #4CAF50; font-size: 12px;');
            
            // Log performance metrics
            if ('performance' in window) {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`%c✓ Page load time: ${loadTime}ms`, 'color: #2196F3; font-size: 12px;');
            }
        }
    }

    // ============================================
    // INITIALIZE ALL MODULES
    // ============================================
    function init() {
        cacheDOM();
        addDynamicStyles();
        initMobileMenu();
        initStickyNavbar();
        initScrollReveal();
        initSmoothScroll();
        initActiveLinks();
        initFormValidation();
        initCardEffects();
        initRippleEffect();
        initLazyLoading();
        initPreventDoubleSubmission();
        logPerformanceMetrics();
        
        // Optional: Initialize scroll to top button
        // initScrollToTop(); // Uncomment if needed
    }

    // Start the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();