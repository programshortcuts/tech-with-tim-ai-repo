// step-nav.js
import { mainTargetDiv } from "../core/inject-content.js";
import { changeTutorialLink } from "../ui/change-tutorial-link.js";
import { denlargeAllImages, clickToggleImgSize } from "../ui/toggle-img-sizes.js";

let steps = [];
let lastStep = null;
const stepStates = new WeakMap();

function createStepState(step) {
    const state = {
        mode: 'stepNav',
        copyIndex: 0,
        mediaIndex: -1,
    };
    stepStates.set(step, state);
    return state;
}

function getStepState(step) {
    if (!step) return null;
    return stepStates.get(step) || createStepState(step);
}

function getStepCopyCodes(step) {
    return step ? [...step.querySelectorAll('.copy-code')] : [];
}

function getStepMedia(step) {
    return step ? [...step.querySelectorAll('.step-img, .step-vid')] : [];
}

function focusCopyCode(step, state, index = 0) {
    const copyCodes = getStepCopyCodes(step);
    if (!copyCodes.length) return false;
    const newIndex = Math.max(0, Math.min(index, copyCodes.length - 1));
    state.copyIndex = newIndex;
    copyCodes[newIndex].focus();
    return true;
}

function enterStepMode(step) {
    const state = getStepState(step);
    const selected = focusCopyCode(step, state, 0);
    if (selected) {
        state.mode = 'stepMode';
        return true;
    }
    state.mode = 'stepNav';
    return false;
}

function resetStepState(step) {
    if (!step) return;
    const state = getStepState(step);
    state.mode = 'stepNav';
    state.copyIndex = 0;
    state.mediaIndex = -1;
    getStepMedia(step).forEach(el => el.classList.remove('enlarge'));
}

function clearStepMedia(step) {
    if (!step) return;
    const state = getStepState(step);
    state.mediaIndex = -1;
    getStepMedia(step).forEach(el => el.classList.remove('enlarge'));
}

function hasEnlargedMedia(step) {
    return getStepMedia(step).some(el => el.classList.contains('enlarge'));
}

function cycleStepMedia(step) {
    const state = getStepState(step);
    const media = getStepMedia(step);
    if (!media.length) return false;

    media.forEach(el => el.classList.remove('enlarge'));

    if (media.length === 1) {
        if (state.mediaIndex === -1) {
            media[0].classList.add('enlarge');
            state.mediaIndex = 0;
        } else {
            state.mediaIndex = -1;
        }
        return true;
    }

    const nextIndex = state.mediaIndex + 1;
    if (nextIndex >= media.length) {
        state.mediaIndex = -1;
        return true;
    }

    media[nextIndex].classList.add('enlarge');
    state.mediaIndex = nextIndex;
    return true;
}

function focusStep(index) {
    if (!steps.length) return;
    let normalized = index;
    if (normalized < 0) normalized = steps.length - 1;
    if (normalized >= steps.length) normalized = 0;
    steps[normalized]?.focus();
}

export function getSteps() {
    return steps;
}

export function updateSteps() {
    initStepNav();
    return steps;
}

export function removeALLSideLinkChange() {
    document.querySelectorAll('.sideLinkChange').forEach(el => el.classList.remove('sideLinkChange'));
}
function handleStepNavKey({ e, step, state, key }) {
    if (key === 'enter') {
        const copyCodes = getStepCopyCodes(step);
        if (!copyCodes.length) {
            cycleStepMedia(step);
            return true;
        }
        enterStepMode(step);
        return true;
    }

    if (key === 'a'  || key === 'arrowup') {
        const currentIndex = steps.indexOf(step);
        focusStep(currentIndex - 1);
        return true;
    }

    if (key === 'f'  || key === 'arrowdown') {
        const currentIndex = steps.indexOf(step);
        focusStep(currentIndex + 1);
        return true;
    }

    if (!isNaN(key)) {
        const targetIndex = parseInt(key, 10) - 1;
        if (targetIndex >= 0 && targetIndex < steps.length) {
            steps[targetIndex].focus();
            return true;
        }
    }

    return false;
}

function handleStepModeKey({ e, step, state, key, isCopyCode }) {
    if (key === 'enter') {
        if (isCopyCode) {
            cycleStepMedia(step);
            return true;
        }
        enterStepMode(step);
        return true;
    }

    if (key === 'a') {
        const copyCodes = getStepCopyCodes(step);
        if (!copyCodes.length) return false;
        const nextIndex = (state.copyIndex - 1 + copyCodes.length) % copyCodes.length;
        state.mode = 'stepMode';
        focusCopyCode(step, state, nextIndex);
        return true;
    }

    if (key === 'f') {
        const copyCodes = getStepCopyCodes(step);
        if (!copyCodes.length) return false;
        const nextIndex = (state.copyIndex + 1) % copyCodes.length;
        state.mode = 'stepMode';
        focusCopyCode(step, state, nextIndex);
        return true;
    }

    if (!isNaN(key)) {
        const copyCodes = getStepCopyCodes(step);
        const targetIndex = parseInt(key, 10) - 1;
        if (targetIndex >= 0 && targetIndex < copyCodes.length) {
            state.mode = 'stepMode';
            focusCopyCode(step, state, targetIndex);
            return true;
        }
    }

    return false;
}

export function initStepNav() {
    steps = [...mainTargetDiv.querySelectorAll('.step-float')];
    steps.forEach((step, index) => {
        if (!step.hasAttribute('tabindex')) {
            step.setAttribute('tabindex', '0');
        }
        getStepState(step);

        step.addEventListener('focusin', () => {
            lastStep = step;
            const state = getStepState(step);
            state.mode = 'stepNav';
            state.copyIndex = 0;
        });

        step.addEventListener('focusout', e => {
            if (!e.relatedTarget || !step.contains(e.relatedTarget)) {
                resetStepState(step);
                denlargeAllImages();
            }
        });

        const handleStepMediaTap = e => {
            const mediaTarget = e.target.closest('.step-img, .step-vid, img, video');
            if (!mediaTarget) return false;
            e.stopPropagation();
            lastStep = step;
            clickToggleImgSize(mediaTarget);
            return true;
        };

        step.addEventListener('touchend', e => {
            if (handleStepMediaTap(e)) {
                e.preventDefault();
            }
        });

        step.addEventListener('click', e => {
            if (handleStepMediaTap(e)) return;

            lastStep = step;
            changeTutorialLink(e);
        });

        if (step.hasAttribute('autofocus')) {
            step.focus();
            lastStep = step;
        }
    });
}

export function getLastStep() {
    return lastStep;
}

export function scrollToCenter({ el, smooth }) {
    if (!el) return;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'center' });
}

function handleRootStepNavigation({ e, key, isMainTarget }) {
    if (!steps.length) return false;
    if (key === 'enter') {
        steps[0].focus();
        return true;
    }
    if (key === 'a'  || key === 'arrowup') {
        if (isMainTarget || !lastStep) {
            focusStep(steps.length - 1);
        } else {
            focusStep(steps.indexOf(lastStep) - 1);
        }
        return true;
    }
    if (key === 'f' || key === 'arrowdown') {
        if (isMainTarget || !lastStep) {
            focusStep(0);
        } else {
            focusStep(steps.indexOf(lastStep) + 1);
        }
        return true;
    }
    if (!isNaN(key)) {
        const targetIndex = parseInt(key, 10) - 1;
        if (targetIndex >= 0 && targetIndex < steps.length) {
            steps[targetIndex].focus();
            return true;
        }
    }
    return false;
}

export function stepNav({ e, navState }) {
    if (navState.zone !== 'mainTargetDiv') return false;
    const key = e.key.toLowerCase();
    const step = e.target.closest('.step-float');
    const isMainTarget = e.target === mainTargetDiv || e.target.closest('#mainTargetDiv') === mainTargetDiv;
    const activeStep = step || (isMainTarget ? null : lastStep);
    const isCopyCode = !!e.target.closest('.copy-code');
    const isStepFocused = step && e.target === step;

    if (key === 'enter' && e.shiftKey && activeStep) {
        e.preventDefault();
        if (e.target !== activeStep) {
            resetStepState(activeStep);
            activeStep.focus();
            return true;
        }
        cycleStepMedia(activeStep);
        return true;
    }

    if (key === 'enter' && isStepFocused && !getStepCopyCodes(step).length) {
        e.preventDefault();
        cycleStepMedia(step);
        return true;
    }

    if (key === 'enter' && !e.shiftKey && isStepFocused && hasEnlargedMedia(step) && getStepCopyCodes(step).length) {
        e.preventDefault();
        clearStepMedia(step);
        return true;
    }

    if (!activeStep) {
        const handled = handleRootStepNavigation({ e, key, isMainTarget });
        if (handled) {
            e.preventDefault();
        }
        return handled;
    }

    const state = getStepState(activeStep);
    if (state.mode === 'stepMode' || isCopyCode) {
        if (handleStepModeKey({ e, step: activeStep, state, key, isCopyCode })) {
            e.preventDefault();
            return true;
        }
    }

    if (step) {
        if (handleStepNavKey({ e, step: activeStep, state, key })) {
            e.preventDefault();
            return true;
        }
    }

    return false;
}
