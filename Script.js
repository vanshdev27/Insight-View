
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const insightTextAnimated = document.getElementById('insight-text-animated');
    const viewTextAnimated = document.getElementById('view-text-animated');
    const insightViewAnimatedText = document.querySelector('.insight-view-animated-text');
    const verticalLine = document.getElementById('vertical-line');
    const progressBarContainer = document.getElementById('progress-bar-container');
    
    const mainContent = document.getElementById('main-content');
    const pageScrollProgressBar = document.getElementById('page-scroll-progress-bar');

    // Loading Animation
    let progress = 0;
    const loadingDuration = 2000; // 2 seconds for progress bar fill
    const textAnimationDelay = 500; // after progress bar reaches 100%
    const textMoveDuration = 600;
    const verticalLineAppearDuration = 500;
    const revealSiteDelay = 300; // after text moves out

    const intervalTime = loadingDuration / 100;

    const progressInterval = setInterval(() => {
        progress++;
        if (progress <= 100) {
            progressBar.style.width = `${progress}%`;
            progressPercentage.textContent = `${progress}%`;
        } else {
            clearInterval(progressInterval);
            animatePostLoading();
        }
    }, intervalTime);

    function animatePostLoading() {
        // Hide progress bar and percentage
        progressBarContainer.style.opacity = '0';
        progressPercentage.style.opacity = '0';

        setTimeout(() => {
            // Rotate progress bar concept (simulated by vertical line)
            verticalLine.style.opacity = '1';
            verticalLine.style.height = '60px'; // Grow vertical line
            // Adjust top position considering the new flex layout of .loading-content
            // The vertical line should ideally be positioned relative to .insight-view-animated-text
            // For simplicity, keeping this logic, but it might need fine-tuning if layout significantly changes.
            verticalLine.style.top = `calc(50% - 30px - ${insightViewAnimatedText.offsetHeight / 2}px)`;


            setTimeout(() => {
                insightViewAnimatedText.classList.add('visible');
                
                setTimeout(() => {
                    insightTextAnimated.style.transform = 'translateX(-150%)';
                    viewTextAnimated.style.transform = 'translateX(150%)';
                    verticalLine.style.opacity = '0'; // Fade out vertical line
                    verticalLine.style.height = '200px'; // Or expand to transition

                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                        mainContent.classList.add('visible');
                        // Trigger entrance animation for main content (CSS handles this)
                        initPageFeatures();
                    }, textMoveDuration + revealSiteDelay);
                }, textMoveDuration); // Time for text to be visible before moving
            }, verticalLineAppearDuration); // After vertical line appears
        }, 300); // Small delay after 100%
    }


    function initPageFeatures() {
        // Scroll Progress Bar
        const updateScrollProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollTop / scrollHeight) * 100;
            if (pageScrollProgressBar) {
                 pageScrollProgressBar.style.width = `${scrolled}%`;
            }
        };
        window.addEventListener('scroll', updateScrollProgress);

        // Parallax Effect
        const parallaxElements = document.querySelectorAll('.parallax-element');
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset;
            parallaxElements.forEach(el => {
                let speed = parseFloat(el.dataset.speed) || 0.5; // Ensure speed is a number
                // Check if element is in viewport for performance
                const rect = el.getBoundingClientRect();
                 // Only animate if the element is somewhat visible or about to be visible
                if (rect.bottom >= -window.innerHeight && rect.top <= 2 * window.innerHeight) {
                    // Calculate offset relative to the element's original position within its parent section
                    // This requires the parent '.scroll-section' to be the reference for offset calculation
                    let section = el.closest('.scroll-section');
                    let sectionScrollTop = section ? scrollTop - section.offsetTop : scrollTop;
                    let offset = sectionScrollTop * speed;
                    el.style.transform = `translateY(${offset * 0.3}px)`;
                }
            });
        });
        
        // Active Nav Link Highlighting
        const sections = document.querySelectorAll('main > section[id]'); // Select direct children sections of main
        const navLinks = document.querySelectorAll('#main-header nav a');

        function changeNav() {
            let index = sections.length;
            // Iterate backwards over sections to find the one currently in view
            while(--index >= 0 && window.scrollY + 100 < sections[index].offsetTop) {} 
            
            navLinks.forEach((link) => link.classList.remove('active-link'));
            // Check if the found index is valid for navLinks
            if (index >= 0 && navLinks[index]) { 
                 navLinks[index].classList.add('active-link');
            } else if (index < 0 && navLinks.length > 0) { // Default to first link if above all sections
                 navLinks[0].classList.add('active-link');
            }
        }
        changeNav(); // Initial call
        window.addEventListener('scroll', changeNav);


        // Button Ripple Effect
        const buttons = document.querySelectorAll('.cta-button, .more-info-button, .download-data-link');
        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                // For 'a' tags that are buttons, ensure ripple is contained if needed
                // or that click doesn't propagate if it's purely for ripple.
                // Current setup is fine for visual effect.
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600); // Match animation duration
            });
        });

        // Features Section Auto-rotation
        const featureCards = document.querySelectorAll('.feature-card');
        const featureDots = document.querySelectorAll('.feature-nav-dots .dot');
        let currentFeatureIndex = 0;
        let featureInterval;
        const featureRotationTime = 4000; // 4 seconds

        function showFeature(index) {
            featureCards.forEach((card, i) => {
                const loaderBar = card.querySelector('.feature-progress-loader .loader-bar');
                if (i === index) {
                    card.classList.add('active-feature');
                    if(loaderBar) {
                        loaderBar.style.transition = 'none'; // Reset transition for instant fill to 0
                        loaderBar.style.width = '0%';
                        setTimeout(() => { // Force reflow
                            loaderBar.style.transition = `width ${featureRotationTime}ms linear`;
                            loaderBar.style.width = '100%';
                        }, 20);
                    }
                } else {
                    card.classList.remove('active-feature');
                     if(loaderBar) {
                        loaderBar.style.transition = 'none';
                        loaderBar.style.width = '0%';
                    }
                }
            });
            featureDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentFeatureIndex = index;
        }

        function nextFeature() {
            currentFeatureIndex = (currentFeatureIndex + 1) % featureCards.length;
            showFeature(currentFeatureIndex);
        }

        function startFeatureRotation() {
            clearInterval(featureInterval); // Clear existing interval if any
            showFeature(currentFeatureIndex); // Show initial feature
            featureInterval = setInterval(nextFeature, featureRotationTime);
        }

        featureDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.featureIndex);
                showFeature(index);
                // Reset interval to give full time for manually selected feature
                clearInterval(featureInterval);
                featureInterval = setInterval(nextFeature, featureRotationTime);
            });
        });
        
        if (featureCards.length > 0) {
            startFeatureRotation(); // Start rotation if features exist
        }


        // Modals
        const modalOverlay = document.getElementById('modal-overlay');
        const modalContainer = document.getElementById('modal-container');
        const modalTitleEl = document.getElementById('modal-title'); // Renamed to avoid conflict
        const modalBody = document.getElementById('modal-body');
        const modalCloseButton = document.getElementById('modal-close-button');
        const moreInfoButtons = document.querySelectorAll('.more-info-button');

        function openModal(modalId) {
            const modalContentTemplate = document.getElementById(modalId);
            if (!modalContentTemplate) {
                console.error('Modal content template not found:', modalId);
                return;
            }
            const titleElement = modalContentTemplate.querySelector('[data-title]');
            if(modalTitleEl) modalTitleEl.textContent = titleElement ? titleElement.textContent : 'Details';
            
            // Clone content excluding the title element itself
            const contentClone = modalContentTemplate.cloneNode(true);
            const titleInClone = contentClone.querySelector('[data-title]');
            if (titleInClone) titleInClone.remove(); // Remove title from cloned content
            
            modalBody.innerHTML = ''; // Clear previous content
            modalBody.appendChild(contentClone); // Append the rest of the content

            modalOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        function closeModal() {
            modalOverlay.classList.add('hidden');
            document.body.style.overflow = ''; // Restore background scroll
        }

        moreInfoButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.dataset.modalTarget;
                openModal(modalId);
            });
        });

        if(modalCloseButton) modalCloseButton.addEventListener('click', closeModal);
        if(modalOverlay) modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay && !modalOverlay.classList.contains('hidden')) {
                closeModal();
            }
        });

        // Cursor Follower
        const cursorFollower = document.getElementById('cursor-follower');
        if (cursorFollower) {
            let mouseX = 0, mouseY = 0;
            let followerX = 0, followerY = 0;
            const speed = 0.1; // Smoothing factor

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            
            function animateFollower() {
                let dx = mouseX - followerX;
                let dy = mouseY - followerY;

                followerX += dx * speed;
                followerY += dy * speed;

                cursorFollower.style.transform = `translate(${followerX - (cursorFollower.offsetWidth / 2)}px, ${followerY - (cursorFollower.offsetHeight / 2)}px) scale(${cursorFollower.style.getPropertyValue('scale') || 1})`; // Maintain scale
                
                requestAnimationFrame(animateFollower);
            }
            // Only show follower if not on a touch device (basic check)
            if (!('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)) {
               animateFollower();
            } else {
                cursorFollower.style.display = 'none';
            }
            
            const interactiveElements = 'a, button, .feature-nav-dots .dot, input[type="text"], input[type="email"], textarea';
            document.querySelectorAll(interactiveElements).forEach(el => {
                el.addEventListener('mouseenter', () => cursorFollower.style.transform = `translate(${followerX - (cursorFollower.offsetWidth / 2)}px, ${followerY - (cursorFollower.offsetHeight / 2)}px) scale(1.5)`);
                el.addEventListener('mouseleave', () => cursorFollower.style.transform = `translate(${followerX - (cursorFollower.offsetWidth / 2)}px, ${followerY - (cursorFollower.offsetHeight / 2)}px) scale(1)`);
            });
        }
        
        // Smooth scroll for nav links (if html scroll-behavior is not enough or for more control)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                // Ensure it's an on-page link and not just "#"
                if (href.length > 1 && href.startsWith('#')) {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                         // Optional: Update URL hash without jumping, if desired for history
                        // history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    // The initPageFeatures() is called inside animatePostLoading after the loading animation completes.
});
