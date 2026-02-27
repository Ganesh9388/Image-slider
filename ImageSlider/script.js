document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');

    let currentIndex = 0;
    let autoSlideInterval;
    let isTransitioning = false;
    const intervalTime = 3000; // 5 seconds
    const transitionTime = 600; // Match CSS transition duration

    // Initialize the slider
    function initSlider() {
        startAutoSlide();
        updateProgressBar();
    }

    function showSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        // Stop current interval
        stopAutoSlide();

        // Calculate next index
        currentIndex = (index + slides.length) % slides.length;

        // Force an immediate update of classes to prevent stale states
        requestAnimationFrame(() => {
            slides.forEach((slide, i) => {
                const isActive = i === currentIndex;
                slide.classList.toggle('active', isActive);
                slide.setAttribute('aria-hidden', !isActive);
            });

            dots.forEach((dot, i) => {
                const isActive = i === currentIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-pressed', isActive);
            });

            // Restart progress and interval
            updateProgressBar();
            startAutoSlide();

            // Unlock after transition
            setTimeout(() => {
                isTransitioning = false;
            }, transitionTime);
        });
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    function startAutoSlide() {
        // Clear existing interval just in case
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, intervalTime);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    function updateProgressBar() {
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';

        // Force reflow
        void progressBar.offsetHeight;

        progressBar.style.transition = `width ${intervalTime}ms linear`;
        progressBar.style.width = '100%';
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            showSlide(index);
        });
    });

    // Pause on hover
    const sliderWrapper = document.getElementById('sliderWrapper');
    sliderWrapper.addEventListener('mouseenter', () => {
        stopAutoSlide();
        progressBar.style.transition = 'none';
    });

    sliderWrapper.addEventListener('mouseleave', () => {
        startAutoSlide();
        // Resume progress bar logic could be complex, 
        // for now we just restart it for simplicity and UX feel
        updateProgressBar();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    initSlider();
});
