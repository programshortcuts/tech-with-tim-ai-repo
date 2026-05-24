// video-controls.js

const state = {
    activeVideo: null
};

/**
 * Attach controls to a video inside a step
 */
export function bindVideoControls(stepFloat) {
    if (!stepFloat) return;

    const vid = stepFloat.querySelector("video");
    if (!vid) return;

    // CLICK: toggle enlarge + set active video
    vid.addEventListener("click", (e) => {
        setActiveVideo(vid);
        toggleEnlarge(stepFloat);
    });

    // KEYBOARD: only when video or container is focused
    stepFloat.addEventListener("keydown", (e) => {
        handleKey(vid, e);
    });
}

/**
 * Set current active video for keyboard control
 */
function setActiveVideo(vid) {
    state.activeVideo = vid;
}

/**
 * Toggle UI enlarge state only (NO playback logic here)
 */
function toggleEnlarge(stepFloat) {
    stepFloat.classList.toggle("enlarge");
}

/**
 * Keyboard handler (single video only)
 */
function handleKey(vid, e) {
    const key = e.keyCode;

    if (!vid) return;

    switch (key) {
        case 13: // Enter → play/pause
            if (vid.paused) {
                vid.play();
            } else {
                vid.pause();
            }
            break;

        case 32: // Space
            e.preventDefault();
            if (vid.currentTime >= vid.duration) {
                vid.currentTime = 0;
            }
            vid.paused ? vid.play() : vid.pause();
            break;

        case 37: // Left
            vid.currentTime = Math.max(0, vid.currentTime - 0.5);
            break;

        case 39: // Right
            vid.currentTime = Math.min(vid.duration, vid.currentTime + 0.5);
            break;

        case 27: // ESC → collapse
            const step = vid.closest(".step-float");
            if (step) step.classList.remove("enlarge");
            break;
    }
}

/**
 * Optional: call this when injecting new content
 */
export function initAllVideos(root = document) {
    const steps = root.querySelectorAll(".step-float");
    steps.forEach(bindVideoControls);
}