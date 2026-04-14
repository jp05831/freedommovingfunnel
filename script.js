// ===== Freedom Movers Landing Page Scripts =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSmoothScroll();
    initCarousel();
    initFormValidation();
    initMobileMenu();
    initCountdown();
});

// ===== Countdown Timer =====
function initCountdown() {
    const countdownEl = document.getElementById('countdown-timer');
    if (!countdownEl) return;
    
    // Set end date to 30 days from now (stored in localStorage to persist)
    let endDate = localStorage.getItem('freedomMoversOfferEnd');
    
    if (!endDate) {
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        endDate = new Date(Date.now() + thirtyDays).getTime();
        localStorage.setItem('freedomMoversOfferEnd', endDate);
    } else {
        endDate = parseInt(endDate);
    }
    
    function updateCountdown() {
        const now = Date.now();
        const diff = endDate - now;
        
        if (diff <= 0) {
            countdownEl.textContent = 'Offer Expired!';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (days > 0) {
            countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else if (hours > 0) {
            countdownEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
        } else {
            countdownEl.textContent = `${minutes}m ${seconds}s`;
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== Smooth Scroll for Anchor Links =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Image Carousel =====
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-btn-prev');
    const nextBtn = carousel.querySelector('.carousel-btn-next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    let currentIndex = 0;
    let autoPlayInterval;
    let isTransitioning = false;
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    function goToSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Handle wrapping
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 4000);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay(); // Reset timer
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay(); // Reset timer
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoPlay(); // Reset timer
        });
    });
    
    // Touch events for mobile swipe
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left
            } else {
                prevSlide(); // Swipe right
            }
        }
    }
    
    // Pause on hover (desktop)
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Start autoplay
    startAutoPlay();
}

// ===== Form Validation & Submission =====
function initFormValidation() {
    const form = document.getElementById('quote-form');
    if (!form) return;
    
    const phoneInput = form.querySelector('#phone');
    const zipFromInput = form.querySelector('#zip-from');
    const zipToInput = form.querySelector('#zip-to');
    
    // Phone number formatting
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = '(' + value;
                } else if (value.length <= 6) {
                    value = '(' + value.slice(0, 3) + ') ' + value.slice(3);
                } else {
                    value = '(' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6, 10);
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Zip code validation (numbers only)
    [zipFromInput, zipToInput].forEach(input => {
        if (input) {
            input.addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
            });
        }
    });
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const phone = form.querySelector('#phone').value.trim();
        const zipFrom = form.querySelector('#zip-from').value.trim();
        const zipTo = form.querySelector('#zip-to').value.trim();
        
        let isValid = true;
        let errorMessage = '';
        
        if (name.length < 2) {
            isValid = false;
            errorMessage = 'Please enter your full name.';
        } else if (!isValidEmail(email)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        } else if (phone.replace(/\D/g, '').length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        } else if (zipFrom.length !== 5) {
            isValid = false;
            errorMessage = 'Please enter a valid 5-digit zip code for "Moving From".';
        } else if (zipTo.length !== 5) {
            isValid = false;
            errorMessage = 'Please enter a valid 5-digit zip code for "Moving To".';
        }
        
        if (!isValid) {
            alert(errorMessage);
            return false;
        }
        
        // Submit to Google Sheets
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            await fetch('https://script.google.com/macros/s/AKfycbwhGP49H4gZi2JF1NghS6MYeEpd_Nhl9zHLCpZdJvepMXhrI0aFCbUwlPLJWTR4YASnWg/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    'zip-from': zipFrom,
                    'zip-to': zipTo
                })
            });
            
            // Redirect to success page
            window.location.href = 'success.html?name=' + encodeURIComponent(name.split(' ')[0]);
            
        } catch (error) {
            console.error('Error:', error);
            // Still redirect - the data likely went through (no-cors doesn't give response)
            window.location.href = 'success.html?name=' + encodeURIComponent(name.split(' ')[0]);
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== Mobile Menu Enhancements =====
function initMobileMenu() {
    // Add scroll behavior for header
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 10) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// ===== Intersection Observer for Animations =====
// Optional: Add fade-in animations as elements come into view
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.trust-item, .review-card, .form-wrapper');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Uncomment to enable scroll animations:
// document.addEventListener('DOMContentLoaded', initScrollAnimations);
