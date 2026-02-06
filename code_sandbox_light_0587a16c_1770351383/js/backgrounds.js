/**
 * Background Image Rotation System
 * Easy system to add and rotate background images
 */

// Configuration - Add your background images here
const backgroundImages = [
    'bg-1.jpg',
    'bg-2.jpg',
    'bg-3.jpg',
    'bg-4.jpg',
    'bg-5.jpg'
    // Add more as needed: 'bg-6.jpg', 'bg-7.jpg', etc.
];

// Settings
const ROTATION_INTERVAL = 10000; // Change image every 10 seconds (10000ms)
const ENABLE_ROTATION = true; // Set to false to disable auto-rotation

/**
 * Initialize background rotation
 */
function initBackgroundRotation() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection || backgroundImages.length === 0) return;
    
    let currentIndex = 0;
    
    // Set initial background
    setBackground(heroSection, currentIndex);
    
    // Only rotate if enabled and have multiple images
    if (ENABLE_ROTATION && backgroundImages.length > 1) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % backgroundImages.length;
            setBackground(heroSection, currentIndex);
        }, ROTATION_INTERVAL);
    }
}

/**
 * Set background image
 */
function setBackground(element, index) {
    // Remove all background classes
    for (let i = 0; i < backgroundImages.length; i++) {
        element.classList.remove(`bg-${i + 1}`);
    }
    
    // Add new background class
    element.classList.add(`bg-${index + 1}`);
}

/**
 * Preload images for smooth transitions
 */
function preloadBackgroundImages() {
    backgroundImages.forEach((image) => {
        const img = new Image();
        img.src = `images/backgrounds/${image}`;
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        preloadBackgroundImages();
        initBackgroundRotation();
    });
} else {
    preloadBackgroundImages();
    initBackgroundRotation();
}

/**
 * HOW TO ADD NEW BACKGROUND IMAGES:
 * 
 * 1. Add your image files to: /images/backgrounds/
 *    Name them: bg-6.jpg, bg-7.jpg, etc.
 * 
 * 2. Add the filename to the backgroundImages array above:
 *    'bg-6.jpg',
 *    'bg-7.jpg',
 * 
 * 3. (Optional) Add CSS class in css/backgrounds.css:
 *    .hero.bg-6::before {
 *        background-image: url('../images/backgrounds/bg-6.jpg');
 *    }
 * 
 * That's it! The system will automatically include it in rotation.
 * 
 * TIPS:
 * - Use landscape/horizontal images (ratio 16:9 or wider)
 * - Optimize images (keep under 200KB each)
 * - Recommended size: 1920x1080 pixels
 * - Use JPG format for photos
 * - Images should work well with low opacity overlay (0.15)
 */
