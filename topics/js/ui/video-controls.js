// video-controls.js

export function initAllVideos(root = document) {
    const steps = root.querySelectorAll('.step-float');

    steps.forEach(step => {
        bindVideo(step);
    });
}

function bindVideo(step) {
    const vid = step.querySelector('video');
    if (!vid) return;

    // prevent duplicate binding after inject-content
    if (vid.dataset.bound === "true") return;
    vid.dataset.bound = "true";

    // CLICK = toggle enlarge (your old behavior)
    vid.addEventListener('click', (e) => {
        toggleStepMedia(step);
    });

    // KEYBOARD = ONLY when step is focused (important for StepNav)
    step.addEventListener('keydown', (e) => {
        handleKeys(vid, step, e);
    });
}

/**
 * OLD BEHAVIOR RESTORED:
 * click toggles enlarge on container (step-float)
 */
function toggleStepMedia(step) {
    step.classList.toggle('enlarge');
}

/**
 * Old-style playback controls, but scoped to step
 */
function handleKeys(vid, step, e) {
    const key = e.key.toLowerCase();

    // ENTER = play/pause (old behavior style)
    if (key === 'enter') {
        e.preventDefault();
        togglePlay(vid);
        return;
    }

    // SPACE = play/pause
    if (key === ' ') {
        e.preventDefault();
        togglePlay(vid);
        return;
    }

    // SHIFT + ENTER = toggle enlarge (matches your image system behavior)
    if (key === 'enter' && e.shiftKey) {
        step.classList.toggle('enlarge');
        return;
    }

    // LEFT / RIGHT scrubbing
    if (e.keyCode === 37) {
        if(!vid.currentTime)return
        vid.currentTime = Math.max(0, vid.currentTime - 0.5);
        return;
    }

    if (e.keyCode === 39) {
        if (!vid.currentTime) return
        vid.currentTime = Math.min(vid.duration, vid.currentTime + 0.5);
        return;
    }

    // ESC = collapse (new but safe)
    if (key === 'escape') {
        step.classList.remove('enlarge');
    }
}

function togglePlay(vid) {
    if (!vid) return;

    if (vid.paused) {
        vid.play();
    } else {
        vid.pause();
    }
}