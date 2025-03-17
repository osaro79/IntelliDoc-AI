/**
 * IntelliDoc AI - Main JavaScript
 * Handles interactive elements and functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only process internal links (not external links)
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                
                // Skip if it's just "#" (to avoid scrolling to top)
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                    }
                    
                    // Calculate header height for offset
                    const headerHeight = document.querySelector('header').offsetHeight;
                    
                    // Scroll to element with offset for fixed header
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // FAQ items toggle (for mobile version)
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (window.innerWidth < 768) {
        faqItems.forEach(item => {
            const question = item.querySelector('h3');
            const answer = item.querySelector('p');
            
            // Initially hide answers
            answer.style.display = 'none';
            
            question.addEventListener('click', function() {
                if (answer.style.display === 'none') {
                    answer.style.display = 'block';
                    item.classList.add('active');
                } else {
                    answer.style.display = 'none';
                    item.classList.remove('active');
                }
            });
        });
    }
    
    // Add active class to current section in navigation
    function highlightNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('nav ul li a');
        
        // Get current scroll position
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        // Check each section to see if it's in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav items
                navItems.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to corresponding nav item
                const correspondingNavItem = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
                if (correspondingNavItem) {
                    correspondingNavItem.classList.add('active');
                }
            }
        });
    }
    
    // Call on scroll and on load
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation();
});

// Form validation for document generator pages
function validateForm(formId) {
    const form = document.getElementById(formId);
    
    if (!form) return true;
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Add error message if not already present
            let errorMsg = field.parentNode.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.parentNode.appendChild(errorMsg);
            }
        } else {
            field.classList.remove('error');
            const errorMsg = field.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    });
    
    return isValid;
}

// Progress indicator update
function updateProgress(step, totalSteps) {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        const percentage = Math.round((step / totalSteps) * 100);
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% Complete`;
    }
}

// Document preview update
function updatePreview(formData) {
    const previewContainer = document.getElementById('document-preview');
    
    if (!previewContainer) return;
    
    // This is a simplified preview - in a real application, 
    // this would likely use a template system or API call
    let previewContent = `
        <div class="preview-header">
            <h3>${formData.documentType || 'Legal Document'}</h3>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="preview-body">
    `;
    
    // Add form fields to preview
    for (const [key, value] of Object.entries(formData)) {
        if (value && key !== 'documentType') {
            // Format the key for display (convert camelCase to Title Case with spaces)
            const formattedKey = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
                
            previewContent += `<p><strong>${formattedKey}:</strong> ${value}</p>`;
        }
    }
    
    previewContent += `
        </div>
        <div class="preview-footer">
            <p>This document is a preview. The final document will be professionally formatted and reviewed.</p>
        </div>
    `;
    
    previewContainer.innerHTML = previewContent;
}

// Countdown timer for document delivery
function startDeliveryCountdown(minutes, displayElement) {
    const display = document.getElementById(displayElement);
    
    if (!display) return;
    
    let timer = minutes * 60;
    const countdown = setInterval(function() {
        const minutesRemaining = Math.floor(timer / 60);
        const secondsRemaining = timer % 60;
        
        display.textContent = `${minutesRemaining}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
        
        if (--timer < 0) {
            clearInterval(countdown);
            display.textContent = "Ready!";
            
            // Update status
            const statusElement = document.querySelector('.status-item.in-progress');
            if (statusElement) {
                statusElement.classList.remove('in-progress');
                statusElement.classList.add('completed');
            }
            
            // Show download button
            const downloadBtn = document.querySelector('.download-btn');
            if (downloadBtn) {
                downloadBtn.classList.remove('disabled');
                downloadBtn.removeAttribute('disabled');
            }
        }
    }, 1000);
}
