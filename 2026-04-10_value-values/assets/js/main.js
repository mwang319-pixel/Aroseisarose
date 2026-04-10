// Keyboard navigation
let currentSlide = 0;
const slides = Array.from(document.querySelectorAll('.slide'));
const pagerIndicator = document.querySelector('.pager-indicator');
const prevButton = document.querySelector('[data-nav="prev"]');
const nextButton = document.querySelector('[data-nav="next"]');

function goToSlide(index) {
    showSlide(index);
}

function updatePager() {
    if (pagerIndicator) {
        pagerIndicator.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }

    if (prevButton) {
        prevButton.disabled = currentSlide === 0;
    }

    if (nextButton) {
        nextButton.disabled = currentSlide === slides.length - 1;
    }
}

function showSlide(index) {
    if (index < 0 || index >= slides.length || index === currentSlide) {
        updatePager();
        return;
    }

    const previousSlide = slides[currentSlide];
    const nextSlide = slides[index];

    if (previousSlide) {
        previousSlide.classList.remove('is-active');
    }

    currentSlide = index;

    if (nextSlide) {
        nextSlide.classList.add('is-active');
        nextSlide.scrollTop = 0;
        revealSlide(nextSlide);
    }

    updatePager();
}

if (prevButton) {
    prevButton.addEventListener('click', () => goToSlide(currentSlide - 1));
}

if (nextButton) {
    nextButton.addEventListener('click', () => goToSlide(currentSlide + 1));
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageModal();
        return;
    }
    
    if (document.querySelector('.image-modal-overlay.active')) {
        return;
    }
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToSlide(currentSlide - 1);
    } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(slides.length - 1);
    }
});

window.addEventListener('load', () => {
    const initialIndex = Math.max(0, Math.min(currentSlide, slides.length - 1));
    currentSlide = initialIndex;
    slides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === initialIndex);
    });
    if (slides[initialIndex]) {
        revealSlide(slides[initialIndex]);
    }
    updatePager();
});

function revealSlide(slide) {
    if (slide.classList.contains('is-visible')) return;

    slide.classList.add('is-visible');

    if (slide.querySelector('.philosophy-grid')) {
        const cards = Array.from(slide.querySelectorAll('.philosophy-card'));
        const sequenceDelays = [0, 120, 240, 360, 480, 600, 720, 840, 960];

        cards.forEach((card, cardIndex) => {
            card.style.setProperty('--reveal-delay', `${cardIndex * 120}ms`);
            card.classList.add('is-visible');

            const phraseParts = Array.from(card.querySelectorAll('.philosophy-text > *'));
            phraseParts.forEach((part, partIndex) => {
                part.style.setProperty('--part-delay', `${sequenceDelays[partIndex] || 0}ms`);
            });
        });
    }

    const revealGroups = [
        '.mvv-wrapper',
        '.content-wrapper',
        '.philosophy-hero',
        '.philosophy-card',
        '.redlines-hero',
        '.redline-item',
        '.final-mvv'
    ];

    revealGroups.forEach((selector) => {
        const elements = slide.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.setProperty('--reveal-delay', `${index * 90}ms`);
        });
    });
}

let modalOverlay = null;

function openImageModal(images, isMulti = false) {
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'image-modal-overlay';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'image-modal-content';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'image-modal-close';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = closeImageModal;
    
    if (isMulti && Array.isArray(images)) {
        const multiContainer = document.createElement('div');
        multiContainer.className = 'image-modal-multi';
        images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '图片';
            multiContainer.appendChild(img);
        });
        modalContent.appendChild(multiContainer);
    } else {
        const img = document.createElement('img');
        img.src = images;
        img.alt = '图片';
        modalContent.appendChild(img);
    }
    
    modalContent.appendChild(closeBtn);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeImageModal();
        }
    });
    
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
    
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            if (modalOverlay && modalOverlay.parentNode) {
                modalOverlay.parentNode.removeChild(modalOverlay);
            }
            modalOverlay = null;
        }, 300);
    }
    document.body.style.overflow = '';
}

function toggleImage(toggle) {
    const content = toggle.nextElementSibling;
    if (!content) return;
    
    const images = content.querySelectorAll('img');
    const placeholders = content.querySelectorAll('.image-placeholder');
    
    // If there are image placeholders but no images, show placeholder content
    if (images.length === 0 && placeholders.length > 0) {
        openPlaceholderModal(placeholders);
        return;
    }
    
    if (images.length === 0) return;
    
    if (images.length === 1) {
        openImageModal(images[0].src);
    } else {
        const imageSources = Array.from(images).map(img => img.src);
        openImageModal(imageSources, true);
    }
}

function openPlaceholderModal(placeholders) {
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'image-modal-overlay';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'image-modal-content';
    modalContent.style.maxWidth = '800px';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'image-modal-close';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = closeImageModal;
    
    const placeholderContainer = document.createElement('div');
    placeholderContainer.style.display = 'flex';
    placeholderContainer.style.flexWrap = 'wrap';
    placeholderContainer.style.gap = '20px';
    placeholderContainer.style.justifyContent = 'center';
    placeholderContainer.style.padding = '20px';
    
    placeholders.forEach(placeholder => {
        const clone = placeholder.cloneNode(true);
        clone.style.minWidth = '300px';
        clone.style.flex = '1';
        placeholderContainer.appendChild(clone);
    });
    
    modalContent.appendChild(placeholderContainer);
    modalContent.appendChild(closeBtn);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeImageModal();
        }
    });
    
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
    
    document.body.style.overflow = 'hidden';
}
