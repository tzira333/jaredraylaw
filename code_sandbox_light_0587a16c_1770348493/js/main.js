// ========================================
// NAVIGATION FUNCTIONALITY
// ========================================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Only handle internal links (starting with #)
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add scrolled class to navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Highlight active navigation link based on scroll position
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ========================================
// SCROLL TO TOP BUTTON
// ========================================

const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// FADE-IN ANIMATIONS ON SCROLL
// ========================================

const fadeElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
    fadeInObserver.observe(element);
});

// ========================================
// CONTACT FORM HANDLING
// ========================================

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Phone number formatting
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    
    e.target.value = value;
});

// Form validation and submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();
    
    // Basic validation
    if (!name || !email || !phone || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Phone validation (at least 10 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        showFormMessage('Please enter a valid phone number.', 'error');
        return;
    }
    
    // Submit form data to RESTful Table API
    const formData = {
        name,
        email,
        phone,
        service: service || 'other',
        message,
        status: 'new'
    };
    
    // Disable submit button to prevent double submissions
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Send to Cloudflare D1 API
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        showFormMessage('Thank you for contacting us! We will get back to you soon.', 'success');
        contactForm.reset();
        
        // Log for demonstration
        console.log('Form submitted successfully:', data);
        
        // Track in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                'event_category': 'Contact',
                'event_label': formData.service || 'General Inquiry'
            });
        }
    })
    .catch(error => {
        showFormMessage('There was an error submitting your form. Please try again or call us directly at (440) 413-5311.', 'error');
        console.error('Form submission error:', error);
    })
    .finally(() => {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    });
});

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }
}

// ========================================
// CALL TRACKING
// ========================================

// Track phone number clicks for analytics
const callLinks = document.querySelectorAll('a[href^="tel:"]');

callLinks.forEach(link => {
    link.addEventListener('click', () => {
        const phoneNumber = link.getAttribute('href').replace('tel:', '');
        
        // Log the call click
        console.log('Call initiated:', phoneNumber);
        
        // Track in analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_call', {
                'event_category': 'Contact',
                'event_label': phoneNumber
            });
        }
        
        // Visual feedback
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = '';
        }, 150);
    });
});

// ========================================
// PAGE LOAD ANIMATIONS
// ========================================

window.addEventListener('load', () => {
    // Fade in hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Log page load
    console.log('%cJared Ray Law', 'color: #1e3a8a; font-size: 24px; font-weight: bold;');
    console.log('%cWebsite loaded successfully! For legal assistance, call (440) 413-5311', 'color: #0ea5e9; font-size: 14px;');
});

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Allow keyboard navigation for custom elements
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Focus management for mobile menu
navToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        // Focus first link when menu opens
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
    }
});

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Debounce scroll events for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll event listeners
const optimizedHighlight = debounce(highlightNavigation, 100);
window.addEventListener('scroll', optimizedHighlight);

// Lazy load images when they come into view
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// FLOATING CALL BUTTON INTERACTION
// ========================================

const floatingCallBtn = document.querySelector('.floating-call-btn');

// Add hover effect for desktop
if (floatingCallBtn && window.innerWidth > 768) {
    floatingCallBtn.addEventListener('mouseenter', () => {
        floatingCallBtn.style.animation = 'none';
    });
    
    floatingCallBtn.addEventListener('mouseleave', () => {
        floatingCallBtn.style.animation = 'pulse 2s infinite';
    });
}

// ========================================
// VISITOR ANALYTICS (DEMO)
// ========================================

// Track page views and interactions
const trackEvent = (category, action, label) => {
    console.log(`Analytics Event - Category: ${category}, Action: ${action}, Label: ${label}`);
    
    // In production, this would send to Google Analytics or similar
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
};

// Track service card clicks
document.querySelectorAll('.service-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const serviceName = e.target.closest('.service-card').querySelector('h3').textContent;
        trackEvent('Services', 'click', serviceName);
    });
});

// Track CTA button clicks
document.querySelectorAll('.cta-banner .btn').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('CTA', 'click', btn.textContent.trim());
    });
});