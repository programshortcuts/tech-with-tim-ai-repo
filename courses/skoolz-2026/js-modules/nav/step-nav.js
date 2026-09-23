import { mainTargetDiv, tutorialLink } from '../core/elements.js';
import { changeTutorialLink } from '../ui/change-tutorial-link.js';
import { denlargeAllImages, clickToggleImgSize } from '../ui/toggle-img-sizes.js';
import { resetVideoToPoster } from '../ui/video-controls.js';
import { isTypingTarget } from './get-focus-zone.js';

let steps = [];
let lastStep = null;
let initialized = false;
const mediaIn = step => [...(step?.querySelectorAll('.step-img, .step-vid') || [])];
const itemsIn = step => [...(step?.querySelectorAll('.copy-code, a[href]') || [])];
const resetVideos = step => step?.querySelectorAll('video').forEach(resetVideoToPoster);

export const getSteps = () => steps;
export const getLastStep = () => lastStep?.isConnected ? lastStep : null;
export function scrollToCenter({ el, smooth = false } = {}) {
    el?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'center', inline: 'center' });
}

function focusStep(index) {
    if (!steps.length) return false;
    const step = steps[(index + steps.length) % steps.length];
    lastStep = step;
    step.focus({ preventScroll: true });
    scrollToCenter({ el: step, smooth: true });
    return true;
}

function cycleStepMedia(step) {
    const media = mediaIn(step);
    if (!media.length) return;
    const nextIndex = Number(step.dataset.mediaIndex ?? -1) + 1;
    denlargeAllImages();
    if (nextIndex >= media.length) {
        step.dataset.mediaIndex = -1;
        return;
    }
    const selected = media[nextIndex];
    selected.classList.add('enlarge');
    step.dataset.mediaIndex = nextIndex;
    const video = selected.matches('.step-vid') ? selected.querySelector('video') : null;
    if (video) {
        mainTargetDiv.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
        try { video.currentTime = 0; } catch { /* Metadata may still be loading. */ }
        video.play()?.catch(() => {});
    }
}

export function updateSteps() {
    initStepNav();
    steps = [...(mainTargetDiv?.querySelectorAll('.step-float') || [])];
    if (!steps.includes(lastStep)) lastStep = null;
    steps.forEach(step => {
        step.setAttribute('tabindex', '0');
        itemsIn(step).forEach(item => {
            if (!item.hasAttribute('tabindex') && !item.matches('a[href]')) item.setAttribute('tabindex', '0');
        });
    });
    return steps;
}

export function initStepNav() {
    if (initialized || !mainTargetDiv) return;
    initialized = true;
    mainTargetDiv.addEventListener('focusin', e => {
        const step = e.target.closest('.step-float');
        if (!step) return;
        lastStep = step;
        if (e.target === step) {
            denlargeAllImages();
            step.dataset.mediaIndex = -1;
            scrollToCenter({ el: step, smooth: true });
        }
    });
    mainTargetDiv.addEventListener('focusout', e => {
        const step = e.target.closest('.step-float');
        if (!step || step.contains(e.relatedTarget)) return;
        resetVideos(step);
        denlargeAllImages();
        step.dataset.mediaIndex = -1;
    });
    mainTargetDiv.addEventListener('click', e => {
        const step = e.target.closest('.step-float');
        if (!step) return;
        if (e.target.closest('a[href], button, .copy-code, .step-vid, .vid-cntrl-btns') || isTypingTarget(e.target)) return;
        lastStep = step;
        changeTutorialLink({ target: step });
        const image = e.target.closest('.step-img');
        if (image) {
            e.preventDefault();
            clickToggleImgSize(image);
            return;
        }
        step.focus({ preventScroll: true });
        scrollToCenter({ el: step, smooth: true });
    });
    updateSteps();
}

export function stepNav({ e, navState }) {
    if (navState.zone !== 'mainTargetDiv' || !e.key || e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return false;
    const key = e.key.toLowerCase();
    const step = e.target.closest('.step-float');
    if (key === 't' && tutorialLink) {
        e.preventDefault();
        tutorialLink.focus();
        window.scrollTo(0, 0);
        return true;
    }
    if (/^[1-9]$/.test(key)) {
        const index = Number(key) - 1;
        if (step && e.target !== step) {
            const copy = step.querySelectorAll('.copy-code')[index];
            if (!copy) return false;
            e.preventDefault();
            copy.focus();
            return true;
        }
        if (!steps[index]) return false;
        e.preventDefault();
        return focusStep(index);
    }
    if (!step) {
        if (!steps.length || !['enter', 'f', 'a'].includes(key)) return false;
        e.preventDefault();
        return focusStep(key === 'a' ? steps.length - 1 : 0);
    }
    if (key === 'enter') {
        if (!e.shiftKey && e.target.closest('a[href], button, [role="button"]')) return false;
        e.preventDefault();
        changeTutorialLink({ target: step });
        if (e.shiftKey) {
            resetVideos(step);
            cycleStepMedia(step);
        } else if (e.target === step) {
            itemsIn(step)[0]?.focus();
        } else cycleStepMedia(step);
        lastStep = step;
        return true;
    }
    if (key === 'f' || key === 'a') {
        const direction = key === 'f' ? 1 : -1;
        if (e.target === step) {
            e.preventDefault();
            return focusStep(steps.indexOf(step) + direction);
        }
        const items = itemsIn(step);
        if (!items.length) return false;
        e.preventDefault();
        mediaIn(step).forEach(media => media.classList.remove('enlarge', 'first-vid-enlarge'));
        step.dataset.mediaIndex = -1;
        const current = items.indexOf(document.activeElement);
        const start = current < 0 ? (direction > 0 ? -1 : 0) : current;
        items[(start + direction + items.length) % items.length].focus();
        return true;
    }
    return false;
}
