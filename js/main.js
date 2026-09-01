/**
 * ============================================================
 * YUKAS DIGITAL HUB — Core Functionality
 * ============================================================
 * Version: 2.0.0
 * Author: YUKAS DIGITAL HUB
 * ============================================================
 */

(function() {
    'use strict';

    // ============================================================
    // 01 — NAVBAR
    // ============================================================

    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    // Mobile Menu Toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                if (hamburger.querySelector('i')) {
                    hamburger.querySelector('i').classList.add('fa-bars');
                    hamburger.querySelector('i').classList.remove('fa-times');
                }
            });
        });
    }

    // Navbar Scroll Effect
    let lastScrollY = 0;
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(5, 7, 11, 0.98)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.borderBottom = '1px solid rgba(37, 99, 235, 0.08)';
        } else {
            navbar.style.background = 'rgba(5, 7, 11, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.borderBottom = '1px solid rgba(37, 99, 235, 0.1)';
        }
        
        lastScrollY = currentScrollY;
    });

    // ============================================================
    // 02 — SCROLL REVEALS (Intersection Observer)
    // ============================================================

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const staggerElements = document.querySelectorAll('.stagger-children');

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });

    staggerElements.forEach(function(el) {
        revealObserver.observe(el);
    });

    // ============================================================
    // 03 — SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================================

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================================
    // 04 — ACTIVE NAV LINK
    // ============================================================

    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.nav-links a');
        
        links.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href === currentPath || (href === 'index.html' && currentPath === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setActiveNavLink();

    // ============================================================
    // 05 — UTILITY: DEBOUNCE
    // ============================================================

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Export utilities
    window.YDH = {
        debounce: debounce,
        version: '2.0.0'
    };

    console.log('✅ YUKAS DIGITAL HUB — Core loaded (v2.0.0)');

})();
