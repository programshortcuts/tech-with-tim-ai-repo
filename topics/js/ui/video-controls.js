// video-controls.js
// video-controls.js

export function initAllVideos(root = document) {

    const stepFloats = root.querySelectorAll('.step-float')

    stepFloats.forEach(bindVideoControls)
}

function bindVideoControls(step) {

    const stepVid = step.querySelector('.step-vid')
    const vid = step.querySelector('video')

    if (!stepVid || !vid) return

    // prevent duplicate listeners
    if (step.dataset.videoBound === 'true') return

    step.dataset.videoBound = 'true'

    // make sure video itself is focusable
    if (!vid.hasAttribute('tabindex')) {
        vid.setAttribute('tabindex', '0')
    }

    /*
    -------------------------
    CLICK VIDEO
    -------------------------
    */

    stepVid.addEventListener('click', e => {

        const clickedControls = e.target.closest(
            '.playbtn, .fwdBtn, .rwdBtn'
        )

        // don't toggle enlarge when clicking controls
        if (clickedControls) return

        e.stopPropagation()

        toggleEnlarge(stepVid, vid)
    })

    /*
    -------------------------
    BUTTON CONTROLS
    -------------------------
    */

    const playBtn = step.querySelector('.playbtn')
    const fwdBtn = step.querySelector('.fwdBtn')
    const rwdBtn = step.querySelector('.rwdBtn')

    playBtn?.addEventListener('click', e => {

        e.stopPropagation()

        togglePlay(vid)

        updatePlayBtn(playBtn, vid)
    })

    fwdBtn?.addEventListener('click', e => {

        e.stopPropagation()

        vid.currentTime = Math.min(
            vid.duration,
            vid.currentTime + 5
        )
    })

    rwdBtn?.addEventListener('click', e => {

        e.stopPropagation()

        vid.currentTime = Math.max(
            0,
            vid.currentTime - 5
        )
    })

    /*
    -------------------------
    KEYBOARD
    IMPORTANT:
    bind to STEP
    not VIDEO
    -------------------------
    */

    step.addEventListener('keydown', e => {

        const key = e.key.toLowerCase()

        const isFocusedInsideThisStep =
            step.contains(document.activeElement)

        if (!isFocusedInsideThisStep) return

        /*
        SPACE
        */

        if (
            key === ' ' ||
            key === 'spacebar'
        ) {

            e.preventDefault()
            e.stopPropagation()

            togglePlay(vid)

            updatePlayBtn(playBtn, vid)

            return
        }

        /*
        ENTER
        */

        if (
            key === 'enter' &&
            !e.shiftKey
        ) {

            e.preventDefault()

            togglePlay(vid)

            updatePlayBtn(playBtn, vid)

            return
        }

        /*
        SHIFT + ENTER
        */

        if (
            key === 'enter' &&
            e.shiftKey
        ) {

            e.preventDefault()

            toggleEnlarge(stepVid, vid)

            return
        }

        /*
        LEFT
        */

        if (e.keyCode === 37) {

            e.preventDefault()

            vid.currentTime = Math.max(
                0,
                vid.currentTime - 0.5
            )

            return
        }

        /*
        RIGHT
        */

        if (e.keyCode === 39) {

            e.preventDefault()

            vid.currentTime = Math.min(
                vid.duration,
                vid.currentTime + 0.5
            )

            return
        }
    })
}

/*
-----------------------------------
HELPERS
-----------------------------------
*/

function toggleEnlarge(stepVid, vid) {

    stepVid.classList.toggle('enlarge')

    if (stepVid.classList.contains('enlarge')) {

        vid.play()

    } else {

        vid.pause()
    }
}

function togglePlay(vid) {

    if (vid.paused) {

        vid.play()

    } else {

        vid.pause()
    }
}

function updatePlayBtn(btn, vid) {

    if (!btn) return

    btn.innerText = vid.paused
        ? '>'
        : '||'
}