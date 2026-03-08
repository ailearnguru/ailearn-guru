// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Module accordion
document.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => {
        const wasOpen = card.classList.contains('open');
        // Close all
        document.querySelectorAll('.module-card').forEach(c => c.classList.remove('open'));
        // Toggle clicked
        if (!wasOpen) card.classList.add('open');
    });
});

// Scroll-triggered fade-in animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to animatable elements
document.querySelectorAll('.module-card, .audience-card, .outcome-card, .about-content, .enrol-card, .section-header').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

