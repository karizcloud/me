/* ==========================================================================
   KARISHMA KALE - PORTFOLIO JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Single Page App Router
    initSPARouting();
    initGmailComposeLinks();
    initCursorEffect();
    initCardInteractions();

    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP is not loaded. Animations will be skipped.');
        initFallbackLayouts();
        return;
    }

    // Initialize Page Controls
    initStickyHeader();
    initMobileMenu();
    initActiveNavObserver();
    
    // Run Animations
    initHeroAnimations();
    initAboutAnimations();
    initSkillsAnimations();
    initJourneyAnimations();
    initProjectsAnimations();
    initContactAnimations();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL EFFECTS
   ========================================================================== */
function initStickyHeader() {
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once at load to handle pre-scrolled pages
    handleScroll();
}

/* ===========================================================================
   GMAIL COMPOSE LINKS
   =========================================================================== */
function initGmailComposeLinks() {
    document.querySelectorAll('[data-gmail-compose]').forEach((link) => {
        link.addEventListener('click', (event) => {
            // Preserve standard browser behavior for keyboard shortcuts and non-primary clicks.
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            event.preventDefault();
            const gmailWindow = window.open(link.dataset.gmailCompose, '_blank', 'noopener,noreferrer');

            // Keep the existing mailto URL as a dependable fallback when a popup cannot open.
            if (!gmailWindow) {
                window.location.href = link.href;
            }
        });
    });
}

/* ===========================================================================
   INTERACTIVE CURSOR & CARD MICRO-INTERACTIONS
   =========================================================================== */
function initCursorEffect() {
    const canUseCursor = window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canUseCursor) return;

    const cursorDot = document.createElement('span');
    const cursorRing = document.createElement('span');
    cursorDot.className = 'cursor-dot';
    cursorRing.className = 'cursor-ring';
    cursorDot.setAttribute('aria-hidden', 'true');
    cursorRing.setAttribute('aria-hidden', 'true');
    document.body.append(cursorDot, cursorRing);
    document.body.classList.add('has-custom-cursor');

    const moveCursor = (event) => {
        cursorDot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        cursorRing.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    window.addEventListener('pointermove', moveCursor, { passive: true });
    document.querySelectorAll('a, button, .skill-category-card, .timeline-content-card, .project-showcase').forEach((item) => {
        item.addEventListener('pointerenter', () => document.body.classList.add('cursor-active'));
        item.addEventListener('pointerleave', () => document.body.classList.remove('cursor-active'));
    });
}

function initCardInteractions() {
    const cards = document.querySelectorAll('.skill-category-card, .timeline-content-card, .project-showcase, .project-canvas-card, .about-visual-card, .contact-card-wrapper, .resume-preview-card');
    const canTilt = window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    cards.forEach((card) => {
        card.classList.add('interactive-card');
        if (!canTilt) return;

        card.addEventListener('pointermove', (event) => {
            const bounds = card.getBoundingClientRect();
            const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
            const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -2;
            card.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`);
            card.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`);
        });
        card.addEventListener('pointerleave', () => {
            card.style.removeProperty('--card-rotate-x');
            card.style.removeProperty('--card-rotate-y');
        });
    });
}

/* ==========================================================================
   2. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    const toggleMenu = () => {
        const isOpen = menuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        
        // Prevent body scroll when menu is open on mobile
        if (isOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };

    const closeMenu = () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
        body.style.overflow = '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when resizing beyond mobile width
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

/* ==========================================================================
   3. ACTIVE NAV LINK TRACKING (INTERSECTION OBSERVER)
   ========================================================================== */
function initActiveNavObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Target active state when section occupies central viewport
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   4. GSAP HERO ENTRANCE TIMELINE
   ========================================================================== */
function initHeroAnimations() {
    // Respect user prefers-reduced-motion setting
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        initFallbackLayouts();
        return;
    }

    // Set initial states for elements before timeline runs to avoid flash of unstyled content
    // Set initial states for elements before timeline runs to avoid flash of unstyled content
    gsap.set('.line-content', { yPercent: 108, opacity: 0 });
    gsap.set('.hero-intro, .hero-description, .hero-metadata, .btn-cta, .socials-container, .credibility-item, .credibility-divider', { 
        opacity: 0, 
        y: 20 
    });
    gsap.set('.header', { y: -80, opacity: 0 });
    gsap.set('.portrait-frame', { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set('.shape-backdrop', { x: -30, y: -30, opacity: 0 });
    gsap.set('.shape-circle', { scale: 0, opacity: 0 });
    gsap.set('.shape-accent-line', { scale: 0, opacity: 0 });

    // Create Main Timeline
    const tl = gsap.timeline({
        defaults: {
            ease: 'power3.out',
            duration: 0.8
        }
    });

    tl.to('.header', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out'
    })
    .to('.hero-intro', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.4')
    .to('.line-content', {
        yPercent: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power4.out'
    }, '-=0.45')
    .to('.hero-description', {
        opacity: 1,
        y: 0
    }, '-=0.6')
    .to('.hero-metadata', {
        opacity: 1,
        y: 0,
        duration: 0.7
    }, '-=0.55')
    .to('.btn-cta', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.5)'
    }, '-=0.5')
    .to('.socials-container', {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, '-=0.4')
    
    // Portrait Masked Reveal Timeline (runs parallel to text entry)
    .to('.portrait-frame', {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: 'power4.inOut'
    }, '0.6')
    .fromTo('.portrait-image', 
        { scale: 1.2 }, 
        { scale: 1.05, duration: 1.6, ease: 'power3.out' }, 
        '0.6'
    )
    
    // Abstract Shapes entry
    .to('.shape-backdrop', {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, '1.4')
    .to('.shape-circle', {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'back.out(1.2)'
    }, '1.5')
    .to('.shape-accent-line', {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
    }, '1.6')

    // Credibility Strip staggered entry
    .to('.credibility-item', {
        opacity: 1,
        y: 0,
        stagger: 0.18,
        duration: 0.8,
        ease: 'power3.out'
    }, '1.2')
    .to('.credibility-divider', {
        opacity: 1,
        y: 0,
        scaleY: 1,
        stagger: 0.18,
        duration: 0.6,
        ease: 'power2.inOut'
    }, '1.3');

    // Safety net: a delayed network/font load must never leave the hero masked.
    window.setTimeout(() => {
        document.querySelectorAll('.hero-headline .line-content').forEach((line) => {
            if (getComputedStyle(line).opacity === '0') {
                gsap.to(line, { yPercent: 0, opacity: 1, duration: 0.35, overwrite: true });
            }
        });
    }, 2400);
}

/* ==========================================================================
   5. GSAP ABOUT SECTION SCROLLTRIGGER TIMELINE
   ========================================================================== */
function initAboutAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        initAboutFallbacks();
        return;
    }

    if (typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollTrigger is not loaded.');
        initAboutFallbacks();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initial states for About elements
    gsap.set('.about-label-wrap', { x: -25, opacity: 0 });
    gsap.set('.about-headline', { y: 35, opacity: 0 });
    gsap.set('.about-p', { y: 24, opacity: 0 });
    gsap.set('.about-cta-wrap', { y: 20, opacity: 0 });
    gsap.set('.about-visual-card', { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, scale: 0.95 });
    gsap.set('.about-shape-backdrop', { scale: 0.85, opacity: 0 });
    gsap.set('.about-shape-circle', { scale: 0, opacity: 0 });

    const aboutTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 75%',
            toggleActions: 'play none none none'
        },
        defaults: {
            ease: 'power3.out',
            duration: 0.8
        },
        onComplete: () => {
            initAboutAmbientAnimation();
        }
    });

    // 1. Section label reveals first with subtle horizontal movement
    aboutTl.to('.about-label-wrap', {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out'
    })
    // 2. Heading reveals with a slightly stronger upward motion
    .to('.about-headline', {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out'
    }, '-=0.4')
    // 3. Paragraphs appear sequentially with a small stagger
    .to('.about-p', {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5')
    // 4. CTA follows
    .to('.about-cta-wrap', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.4)'
    }, '-=0.3')
    // 5. Right-side visual reveals independently using masked/clip-path style animation
    .to('.about-shape-backdrop', {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out'
    }, '0.3')
    .to('.about-shape-circle', {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.5)'
    }, '0.5')
    .to('.about-visual-card', {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: 'power4.inOut'
    }, '0.4');
}

/* Subtle ambient movement for SVG visual layers after entrance */
function initAboutAmbientAnimation() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.to('.ambient-layer-1', {
        y: -3,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.ambient-layer-2', {
        y: 3,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.4
    });

    gsap.to('.ambient-layer-3', {
        y: -2,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.8
    });
}

function initAboutFallbacks() {
    const resetStyles = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.clipPath = 'none';
        });
    };

    resetStyles('.about-label-wrap');
    resetStyles('.about-headline');
    resetStyles('.about-p');
    resetStyles('.about-cta-wrap');
    resetStyles('.about-visual-card');
    resetStyles('.about-shape-backdrop');
    resetStyles('.about-shape-circle');
}

/* ==========================================================================
   6. GSAP SKILLS / TECH STACK SECTION SCROLLTRIGGER TIMELINE
   ========================================================================== */
function initSkillsAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        initSkillsFallbacks();
        return;
    }

    if (typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollTrigger is not loaded.');
        initSkillsFallbacks();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initial states for Skills elements
    gsap.set('.skills-label-wrap', { x: -24, opacity: 0 });
    gsap.set('.skills-headline', { y: 28, opacity: 0 });
    gsap.set('.skills-subtext', { y: 20, opacity: 0 });
    gsap.set('.skill-category-card', { y: 30, opacity: 0, scale: 0.98 });
    gsap.set('.tech-item', { y: 15, opacity: 0, scale: 0.92 });

    const skillsTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.skills-section',
            start: 'top 75%',
            toggleActions: 'play none none none'
        },
        defaults: {
            ease: 'power3.out'
        }
    });

    // 1. Section label enters with subtle horizontal reveal
    skillsTl.to('.skills-label-wrap', {
        x: 0,
        opacity: 1,
        duration: 0.6
    })
    // 2. Main heading & subtext reveal upward
    .to('.skills-headline', {
        y: 0,
        opacity: 1,
        duration: 0.7
    }, '-=0.35')
    .to('.skills-subtext', {
        y: 0,
        opacity: 1,
        duration: 0.6
    }, '-=0.45')
    // 3. Category cards appear in sequence with card stagger
    .to('.skill-category-card', {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        duration: 0.65,
        ease: 'power3.out'
    }, '-=0.3');

    // 4. Technology icons/items reveal category by category with custom stagger per category
    const categories = ['frontend', 'backend', 'database', 'aidata', 'tools'];
    const staggers = [0.06, 0.08, 0.08, 0.08, 0.07];

    categories.forEach((cat, idx) => {
        skillsTl.to(`.skill-category-card[data-category="${cat}"] .tech-item`, {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: staggers[idx],
            duration: 0.5,
            ease: 'back.out(1.4)'
        }, `-=${0.45 - idx * 0.05}`);
    });
}

function initSkillsFallbacks() {
    const resetStyles = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.clipPath = 'none';
        });
    };

    resetStyles('.skills-label-wrap');
    resetStyles('.skills-headline');
    resetStyles('.skills-subtext');
    resetStyles('.skill-category-card');
    resetStyles('.tech-item');
}

/* ==========================================================================
   7. GSAP EXPERIENCE & EDUCATION / MY JOURNEY SECTION SCROLLTRIGGER TIMELINE
   ========================================================================== */
function initJourneyAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        initJourneyFallbacks();
        return;
    }

    if (typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollTrigger is not loaded.');
        initJourneyFallbacks();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initial states for header & spine
    gsap.set('.journey-label-wrap', { x: -24, opacity: 0 });
    gsap.set('.journey-headline', { y: 28, opacity: 0 });
    gsap.set('.journey-subtext', { y: 20, opacity: 0 });
    gsap.set('.timeline-spine-fill', { scaleY: 0 });

    // Initial states for timeline elements
    gsap.set('.timeline-year', { x: -16, opacity: 0 });
    gsap.set('.timeline-node-dot', { scale: 0, opacity: 0 });
    gsap.set('.timeline-content-card', { x: 22, opacity: 0 });

    // Header & continuous spine line reveal
    const headerTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.journey-section',
            start: 'top 75%',
            toggleActions: 'play none none none'
        },
        defaults: {
            ease: 'power3.out'
        }
    });

    headerTl.to('.journey-label-wrap', {
        x: 0,
        opacity: 1,
        duration: 0.6
    })
    .to('.journey-headline', {
        y: 0,
        opacity: 1,
        duration: 0.7
    }, '-=0.35')
    .to('.journey-subtext', {
        y: 0,
        opacity: 1,
        duration: 0.6
    }, '-=0.45')
    .to('.timeline-spine-fill', {
        scaleY: 1,
        duration: 1.4,
        ease: 'power2.inOut'
    }, '-=0.2');

    // Milestone-by-milestone progressive activation
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
        const itemTl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top 82%',
                toggleActions: 'play none none none'
            },
            defaults: {
                ease: 'power3.out'
            }
        });

        itemTl
            // Marker activates with slight back easing
            .to(item.querySelector('.timeline-node-dot'), {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: 'back.out(1.6)'
            })
            // Year label appears
            .to(item.querySelector('.timeline-year'), {
                x: 0,
                opacity: 1,
                duration: 0.45
            }, '-=0.35')
            // Content card reveals with smooth translation
            .to(item.querySelector('.timeline-content-card'), {
                x: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.3');
    });
}

function initJourneyFallbacks() {
    const resetStyles = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.clipPath = 'none';
        });
    };

    resetStyles('.journey-label-wrap');
    resetStyles('.journey-headline');
    resetStyles('.journey-subtext');
    resetStyles('.timeline-spine-fill');
    resetStyles('.timeline-year');
    resetStyles('.timeline-node-dot');
    resetStyles('.timeline-content-card');
}

/* ==========================================================================
   8. GSAP FEATURED WORK / PROJECTS SECTION SCROLLTRIGGER TIMELINE
   ========================================================================== */
function initProjectsAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        initProjectsFallbacks();
        return;
    }

    if (typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollTrigger is not loaded.');
        initProjectsFallbacks();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initial states for section header
    gsap.set('.projects-label-wrap', { x: -24, opacity: 0 });
    gsap.set('.projects-headline', { y: 28, opacity: 0 });
    gsap.set('.projects-subtext', { y: 20, opacity: 0 });

    // Section Header ScrollTrigger
    const headerTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.projects-section',
            start: 'top 75%',
            toggleActions: 'play none none none'
        },
        defaults: {
            ease: 'power3.out'
        }
    });

    headerTl.to('.projects-label-wrap', {
        x: 0,
        opacity: 1,
        duration: 0.6
    })
    .to('.projects-headline', {
        y: 0,
        opacity: 1,
        duration: 0.7
    }, '-=0.35')
    .to('.projects-subtext', {
        y: 0,
        opacity: 1,
        duration: 0.6
    }, '-=0.45');

    // Individual project storytelling animations
    const showcases = document.querySelectorAll('.project-showcase');
    showcases.forEach((showcase) => {
        const isVisualLeft = showcase.classList.contains('layout-visual-left');
        const visualEntranceX = isVisualLeft ? -28 : 28;

        // Set initial states per project element
        gsap.set(showcase.querySelector('.project-num'), { opacity: 0, y: 15 });
        const badge = showcase.querySelector('.badge-featured');
        if (badge) {
            gsap.set(badge, { opacity: 0, scale: 0.8 });
        }
        gsap.set(showcase.querySelector('.project-canvas-card'), {
            clipPath: 'inset(100% 0% 0% 0%)',
            opacity: 0,
            x: visualEntranceX
        });
        gsap.set(showcase.querySelector('.visual-backdrop-shape'), {
            opacity: 0,
            scale: 0.88
        });
        gsap.set(showcase.querySelector('.project-title'), { opacity: 0, y: 25 });
        gsap.set(showcase.querySelector('.project-description'), { opacity: 0, y: 20 });
        gsap.set(showcase.querySelector('.btn-project-repo'), { opacity: 0, y: 15 });

        const projTl = gsap.timeline({
            scrollTrigger: {
                trigger: showcase,
                start: 'top 75%',
                toggleActions: 'play none none none'
            },
            defaults: {
                ease: 'power3.out'
            }
        });

        // 1. Project number & badge reveal first
        projTl.to(showcase.querySelector('.project-num'), {
            opacity: 1,
            y: 0,
            duration: 0.5
        });

        if (badge) {
            projTl.to(badge, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: 'back.out(1.5)'
            }, '-=0.35');
        }

        // 2. Visual area enters with masked reveal
        projTl.to(showcase.querySelector('.visual-backdrop-shape'), {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out'
        }, '-=0.2')
        .to(showcase.querySelector('.project-canvas-card'), {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: 'power4.inOut'
        }, '-=0.6')

        // 3. Title appears after visual begins
        .to(showcase.querySelector('.project-title'), {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out'
        }, '-=0.5')

        // 4. Description follows
        .to(showcase.querySelector('.project-description'), {
            opacity: 1,
            y: 0,
            duration: 0.6
        }, '-=0.4')

        // 5. Repository button appears last
        .to(showcase.querySelector('.btn-project-repo'), {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'back.out(1.4)'
        }, '-=0.35');
    });
}

function initProjectsFallbacks() {
    const resetStyles = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.clipPath = 'none';
        });
    };

    resetStyles('.projects-label-wrap');
    resetStyles('.projects-headline');
    resetStyles('.projects-subtext');
    resetStyles('.project-num');
    resetStyles('.badge-featured');
    resetStyles('.project-canvas-card');
    resetStyles('.visual-backdrop-shape');
    resetStyles('.project-title');
    resetStyles('.project-description');
    resetStyles('.btn-project-repo');
}

/* ==========================================================================
   9. GSAP LET'S CONNECT / CONTACT SECTION SCROLLTRIGGER TIMELINE
   ========================================================================== */
function initContactAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        initContactFallbacks();
        return;
    }

    if (typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollTrigger is not loaded.');
        initContactFallbacks();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initial states for Contact Card and Child Elements
    gsap.set('.contact-card-wrapper', { opacity: 0, y: 35 });
    gsap.set('.contact-bg-backdrop', { scale: 0.7, opacity: 0 });
    gsap.set('.contact-bg-circle', { scale: 0.7, opacity: 0 });
    gsap.set('.contact-label-wrap', { x: -20, opacity: 0 });
    gsap.set('.contact-line-content', { yPercent: 110, opacity: 0 });
    gsap.set('.contact-p', { y: 20, opacity: 0 });
    gsap.set('.btn-contact-talk', { y: 25, opacity: 0, scale: 0.94 });
    gsap.set('.contact-channel-item', { x: -18, opacity: 0 });
    gsap.set('.contact-visual-composition', { scale: 0.92, opacity: 0, y: 20 });

    const contactTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 75%',
            toggleActions: 'play none none none'
        },
        defaults: {
            ease: 'power3.out'
        }
    });

    // 1. Background card & decorative shapes reveal
    contactTl.to('.contact-card-wrapper', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out'
    })
    .to('.contact-bg-backdrop', {
        scale: 1,
        opacity: 1,
        duration: 1.1,
        ease: 'power2.out'
    }, '-=0.6')
    .to('.contact-bg-circle', {
        scale: 1,
        opacity: 0.75,
        duration: 1.1,
        ease: 'power2.out'
    }, '-=0.9')

    // 2. Section label appears
    .to('.contact-label-wrap', {
        x: 0,
        opacity: 1,
        duration: 0.6
    }, '-=0.7')

    // 3. Main heading reveals line-by-line with masked upward slide
    .to('.contact-line-content', {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
    }, '-=0.4')

    // 4. Supporting paragraphs follow
    .to('.contact-p', {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.14
    }, '-=0.5')

    // 5. CTA enters with slightly stronger movement
    .to('.btn-contact-talk', {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.65,
        ease: 'back.out(1.5)'
    }, '-=0.35')

    // 6. Direct contact channels appear one after another
    .to('.contact-channel-item', {
        x: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.4')

    // 7. Right column abstract visual composition settles
    .to('.contact-visual-composition', {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out'
    }, '-=0.7');
}

function initContactFallbacks() {
    const resetStyles = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.clipPath = 'none';
        });
    };

    resetStyles('.contact-card-wrapper');
    resetStyles('.contact-bg-backdrop');
    resetStyles('.contact-bg-circle');
    resetStyles('.contact-label-wrap');
    resetStyles('.contact-line-content');
    resetStyles('.contact-paragraphs');
    resetStyles('.contact-p');
    resetStyles('.btn-contact-talk');
    resetStyles('.contact-channel-item');
    resetStyles('.contact-visual-composition');
}

/* ==========================================================================
   10. FALLBACKS FOR USER PREFERENCES / NO GSAP
   ========================================================================== */
function initFallbackLayouts() {
    // Reset elements to normal fully-visible state for accessibility and reduced motion
    const resetStyles = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.clipPath = 'none';
        });
    };

    resetStyles('.line-content');
    resetStyles('.hero-intro');
    resetStyles('.hero-description');
    resetStyles('.hero-metadata');
    resetStyles('.btn-cta');
    resetStyles('.socials-container');
    resetStyles('.portrait-frame');
    resetStyles('.portrait-image');
    resetStyles('.shape');
    resetStyles('.credibility-item');
    resetStyles('.credibility-divider');
    resetStyles('.header');
    
    initAboutFallbacks();
    initSkillsFallbacks();
    initJourneyFallbacks();
    initProjectsFallbacks();
    initContactFallbacks();
}

/* ==========================================================================
   11. SINGLE PAGE ROUTER (SPA ROUTING)
   ========================================================================== */
function initSPARouting() {
    const mainSections = document.querySelectorAll('main > section:not(#resume)');
    const resumeSection = document.getElementById('resume');
    const navLinks = document.querySelectorAll('.nav-link');
    const logoLink = document.querySelector('.logo');

    // Parse URL on load / popstate
    const parseLocation = () => {
        const path = window.location.pathname;
        const hash = window.location.hash;

        // Support both hash routing and path routing
        if (path === '/resume' || path.endsWith('/resume') || hash === '#resume' || hash === '#/resume') {
            return '/resume';
        } else if (hash) {
            return hash; // e.g. "#about", "#projects"
        }
        
        // Match specific path sections if the URL is path-based (e.g. /about, /projects)
        const pathRoutes = ['/about', '/projects', '/experience', '/skills', '/contact'];
        for (const route of pathRoutes) {
            if (path === route || path.endsWith(route)) {
                return '#' + route.substring(1);
            }
        }
        
        return '/';
    };

    // Route Handler
    const handleRoute = (routePath, shouldScroll = true) => {
        if (routePath === '/resume') {
            // Hide main portfolio sections
            mainSections.forEach(section => {
                section.style.display = 'none';
            });
            // Show resume section
            if (resumeSection) {
                resumeSection.style.display = 'block';
            }
            // Update nav active classes
            navLinks.forEach(link => {
                if (link.getAttribute('data-route') === '/resume' || link.getAttribute('href') === '#resume') {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            if (shouldScroll) {
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        } else {
            // Show main sections
            mainSections.forEach(section => {
                section.style.display = '';
            });
            // Hide resume section
            if (resumeSection) {
                resumeSection.style.display = 'none';
            }

            // Scroll to the specific section or top
            const targetSectionId = routePath.replace(/^\//, '').replace(/^#/, '');
            if (targetSectionId && targetSectionId !== 'home') {
                const targetElement = document.getElementById(targetSectionId);
                if (targetElement) {
                    if (shouldScroll) {
                        const headerOffset = document.querySelector('.header').offsetHeight || 70;
                        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                        const offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                    // Visual active update
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${targetSectionId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            } else {
                if (shouldScroll) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }

            // Refresh ScrollTrigger so indices are correct after showing/hiding sections
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }
    };

    // Navigate to a new route
    const navigateTo = (routePath) => {
        const isLocalFile = window.location.protocol === 'file:';
        
        if (isLocalFile) {
            // Use hashes on local files to prevent local filesystem 404s
            const cleanHash = routePath.startsWith('/') ? '#' + routePath.substring(1) : routePath;
            window.location.hash = cleanHash;
        } else {
            const cleanPath = routePath.startsWith('/') ? routePath : '/' + routePath.replace(/^#/, '');
            history.pushState(null, '', cleanPath);
            handleRoute(cleanPath);
        }
    };

    // Link interception for all internal anchors/routes
    document.querySelectorAll('a[href^="#"], a[data-route]').forEach(link => {
        link.addEventListener('click', (e) => {
            const route = link.getAttribute('data-route') || link.getAttribute('href');
            if (route) {
                e.preventDefault();
                navigateTo(route);
            }
        });
    });

    // Window event listeners
    window.addEventListener('popstate', () => {
        handleRoute(parseLocation(), false);
    });

    window.addEventListener('hashchange', () => {
        handleRoute(parseLocation(), false);
    });

    // Run router immediately on load
    handleRoute(parseLocation(), false);
}
