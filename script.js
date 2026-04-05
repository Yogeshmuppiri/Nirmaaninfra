// ===================================
// NAVIGATION & SCROLL EFFECTS
// ===================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navbar = document.querySelector('.navbar');

// Enhanced mobile menu toggle with better UX
hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close menu when link is clicked with smooth UX
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Close menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';

        // Smooth scroll to section
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Enhanced navbar background on scroll with mobile considerations
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update hero parallax on mobile (lighter effect)
    const hero = document.querySelector('.hero');
    if (hero) {
        const isMobile = window.innerWidth <= 768;
        const parallaxSpeed = isMobile ? 0.3 : 0.5;
        hero.style.backgroundPosition = `center ${scrollY * parallaxSpeed}px`;
    }
});

// ===================================
// MOBILE OPTIMIZATIONS
// ===================================

// Touch-friendly scroll handling
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndY - touchStartY;

    // Close mobile menu on downward swipe
    if (Math.abs(swipeDistance) > swipeThreshold && swipeDistance > 0) {
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Prevent zoom on double tap for iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Mobile viewport height fix for Safari
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100);
});
setVH();

// ===================================
// ACTIVE NAVIGATION LINK
// ===================================

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#2563eb';
        } else {
            link.style.color = '';
        }
    });
});

// ===================================
// SMOOTH SCROLL BEHAVIOR
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all service cards, stat cards, etc.
document.querySelectorAll('.service-card, .stat-card, .founder-card, .feature-item, .project-card').forEach(element => {
    observer.observe(element);
});

const animateCounter = (card) => {
    const counter = card.querySelector('.stat-value');
    const target = Number(card.dataset.target);
    const suffix = card.dataset.suffix || '';

    if (!counter || Number.isNaN(target) || card.dataset.counted === 'true') {
        return;
    }

    card.dataset.counted = 'true';

    const duration = 1800;
    const start = performance.now();

    const updateCounter = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(target * eased);

        counter.textContent = `${currentValue}${suffix}`;

        if (progress < 1) {
            window.requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = `${target}${suffix}`;
        }
    };

    window.requestAnimationFrame(updateCounter);
};

const statCards = document.querySelectorAll('.stat-card[data-target]');

if ('IntersectionObserver' in window && statCards.length) {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.35
    });

    statCards.forEach(card => {
        statObserver.observe(card);
    });
}

// ===================================
// CONTACT FORM HANDLING (Netlify Forms) - Enhanced for Mobile
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Real-time validation for mobile
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default to handle validation

        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField.call(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showFormMessage('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.background = '#f59e0b';

        // Prepare form data for Netlify and email delivery
        const formData = new FormData(this);
        const submissionData = {
            name: String(formData.get('name') || ''),
            email: String(formData.get('email') || ''),
            subject: String(formData.get('subject') || ''),
            message: String(formData.get('message') || ''),
            siteUrl: window.location.origin
        };

        // Submit to Netlify Forms first, then trigger email delivery
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            return fetch('/.netlify/functions/send-contact-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });
        })
        .then(async response => {
            if (!response.ok) {
                const errorPayload = await response.json().catch(() => ({}));
                throw new Error(errorPayload.error || 'Email delivery failed');
            }

            showFormMessage('Message sent successfully. We will get back to you soon.', 'success');
            submitBtn.textContent = 'Sent';
            submitBtn.style.background = '#10b981';

            // Reset form after success
            setTimeout(() => {
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                clearFormMessages();
            }, 3000);
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showFormMessage('Your form was submitted, but email delivery needs attention. Please contact us directly if urgent.', 'error');
            submitBtn.textContent = 'Try Again';
            submitBtn.style.background = '#ef4444';
            submitBtn.disabled = false;

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
        });
    });
}

// Form validation functions
function validateField() {
    const field = this;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    clearFieldError.call(field);

    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'subject':
            if (!value) {
                errorMessage = 'Subject is required';
                isValid = false;
            } else if (value.length < 5) {
                errorMessage = 'Subject must be at least 5 characters';
                isValid = false;
            }
            break;

        case 'message':
            if (!value) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';

    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 12px;
            margin-top: 4px;
            font-weight: 500;
        `;
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFieldError() {
    this.style.borderColor = '';
    this.style.boxShadow = '';

    const errorElement = this.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function showFormMessage(message, type) {
    clearFormMessages();

    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.style.cssText = `
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-weight: 500;
        font-size: 14px;
        text-align: center;
        ${type === 'success'
            ? 'background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;'
            : 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
        }
    `;
    messageElement.textContent = message;

    contactForm.insertBefore(messageElement, contactForm.firstChild);
}

function clearFormMessages() {
    const messages = contactForm.querySelectorAll('.form-message');
    messages.forEach(msg => msg.remove());
}

// ===================================
// CURSOR EFFECT (Commented out)
// ===================================

// const createCursorEffect = () => {
//     const cursor = document.createElement('div');
//     cursor.className = 'cursor';
//     cursor.style.position = 'fixed';
//     cursor.style.width = '20px';
//     cursor.style.height = '20px';
//     cursor.style.border = '2px solid #2563eb';
//     cursor.style.border-radius = '50%';
//     cursor.style.pointerEvents = 'none';
//     cursor.style.zIndex = '9999';
//     cursor.style.display = 'none';
    
//     document.body.appendChild(cursor);
    
//     let mouseX = 0;
//     let mouseY = 0;
    
//     document.addEventListener('mousemove', (e) => {
//         mouseX = e.clientX;
//         mouseY = e.clientY;
//         cursor.style.left = (mouseX - 10) + 'px';
//         cursor.style.top = (mouseY - 10) + 'px';
//         cursor.style.display = 'block';
//     });
    
//     document.addEventListener('mouseleave', () => {
//         cursor.style.display = 'none';
//     });
// };

// Uncomment to enable custom cursor
// createCursorEffect();

// ===================================
// LAZY LOADING IMAGES
// ===================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// MOBILE RESPONSIVE MENU
// ===================================

const adjustMenuForMobile = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth > 768 && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
};

window.addEventListener('resize', adjustMenuForMobile);

// ===================================
// PAGE LOAD ANIMATION
// ===================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for optimized event handling
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// ENHANCED ANIMATIONS
// ===================================

const enableProjectTilt = () => {
    const projectCards = document.querySelectorAll('.project-card');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth > 1024;

    projectCards.forEach(card => {
        card.style.transform = '';
        card.style.transformStyle = '';
        card.style.transition = '';
        card.onpointermove = null;
        card.onpointerleave = null;
    });

    if (!isDesktop || prefersReducedMotion) {
        return;
    }

    projectCards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = 'transform 0.18s ease, box-shadow 0.25s ease';

        card.onpointermove = (event) => {
            const rect = card.getBoundingClientRect();
            const pointerX = event.clientX - rect.left;
            const pointerY = event.clientY - rect.top;
            const rotateY = ((pointerX / rect.width) - 0.5) * 10;
            const rotateX = (0.5 - (pointerY / rect.height)) * 8;

            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        };

        card.onpointerleave = () => {
            card.style.transform = '';
        };
    });
};

// Add stagger animation to service cards
const enhanceServiceCards = () => {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s backwards`;
    });
};

// Add subtle hover effect to stat cards
const enhanceStatCards = () => {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 20px 50px rgba(37, 99, 235, 0.3)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
        });
    });
};

// Initialize enhancements when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        enhanceServiceCards();
        enhanceStatCards();
        enableProjectTilt();
    });
} else {
    enhanceServiceCards();
    enhanceStatCards();
    enableProjectTilt();
}

// ===================================
// FORM INPUT FOCUS EFFECTS
// ===================================

const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.position = 'relative';
        input.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.3)';
    });
    
    input.addEventListener('blur', () => {
        input.style.boxShadow = 'none';
    });
});

// ===================================
// PROGRESSIVE ENHANCEMENT
// ===================================

// Check if browser supports CSS Grid
const supportsCSSGrid = CSS.supports('display', 'grid');
if (!supportsCSSGrid) {
    console.log('CSS Grid not supported, applying fallback styles');
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Optimize scroll performance with throttling
const optimizedScroll = throttle(() => {
    // Existing scroll handlers
}, 100);

window.addEventListener('scroll', optimizedScroll);
window.addEventListener('resize', debounce(enableProjectTilt, 120));
