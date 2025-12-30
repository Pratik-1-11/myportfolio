// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const backToTopBtn = document.querySelector('.back-to-top');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const form = document.querySelector('.contact-form form');
const sections = document.querySelectorAll('section');
const projectLinks = document.querySelectorAll('.project-link');

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', savedTheme);

// Theme Toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// Update theme icon based on current theme
function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Initialize theme icon on page load
updateThemeIcon(savedTheme);

// Mobile Menu Toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        // Toggle menu visibility
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Toggle body scroll
        document.body.classList.toggle('menu-open');
        
        // Update aria-expanded attribute
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
    });
}

// Close menu when clicking on a nav link
navItems.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger && window.innerWidth <= 768) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});

// Close menu when clicking outside
if (navLinks) {
    document.addEventListener('click', (e) => {
        const isClickInside = navLinks.contains(e.target) || (hamburger && hamburger.contains(e.target));
        if (!isClickInside && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Show/hide back to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
    
    // Update active navigation link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = `#${section.getAttribute('id')}`;
        }
    });
    
    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === current) {
            link.classList.add('active');
        }
    });
});

// Back to top button
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form submission
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        try {
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // In a real application, you would send the form data to a server here
            // For now, we'll simulate a network request
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you! Your message has been sent successfully.';
            successMessage.style.color = '#10b981';
            successMessage.style.marginTop = '1.5rem';
            successMessage.style.fontWeight = '500';
            
            // Remove any existing messages
            const existingMessage = form.querySelector('.success-message, .error-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            form.appendChild(successMessage);
            form.reset();
            
        } catch (error) {
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Oops! Something went wrong. Please try again.';
            errorMessage.style.color = '#ef4444';
            errorMessage.style.marginTop = '1.5rem';
            errorMessage.style.fontWeight = '500';
            
            // Remove any existing messages
            const existingMessage = form.querySelector('.success-message, .error-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            form.appendChild(errorMessage);
        } finally {
            // Re-enable button and restore original text
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            
            // Remove message after 5 seconds
            setTimeout(() => {
                const message = form.querySelector('.success-message, .error-message');
                if (message) {
                    message.style.transition = 'opacity 0.5s ease';
                    message.style.opacity = '0';
                    setTimeout(() => message.remove(), 500);
                }
            }, 5000);
        }
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// Project links - prevent default if href is '#'
projectLinks.forEach(link => {
    if (link.getAttribute('href') === '#') {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // You can add a modal or other interaction here
            console.log('Project link clicked:', link.textContent);
        });
    }
});

// Initialize tooltips if using any
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(el => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = el.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        const showTooltip = (e) => {
            tooltip.style.display = 'block';
            updateTooltipPosition(e);
        };
        
        const hideTooltip = () => {
            tooltip.style.display = 'none';
        };
        
        const updateTooltipPosition = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            tooltip.style.left = `${x + 10}px`;
            tooltip.style.top = `${y + 10}px`;
        };
        
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mousemove', updateTooltipPosition);
        el.addEventListener('mouseleave', hideTooltip);
    });
}

// Call initTooltips if you have elements with data-tooltip attribute
// initTooltips();

// Add animation class to hero content for initial load
document.addEventListener('DOMContentLoaded', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('fade-in-up');
    }
    
    // Add animation delay to hero buttons
    const heroButtons = document.querySelector('.cta-buttons');
    if (heroButtons) {
        heroButtons.style.animationDelay = '0.3s';
    }
});

// Handle external links (open in new tab)
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (link.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});