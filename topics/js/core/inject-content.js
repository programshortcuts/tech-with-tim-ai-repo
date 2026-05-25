// inject-content.js
// inject-content.js

import { initAllVideos } from "../ui/video-controls.js"
import { initCopyCode } from "../ui/copy-code.js"
import { updateSteps } from "../nav/step-nav.js"
import { refreshImages } from "../ui/toggle-img-sizes.js"

export const mainTargetDiv =
    document.querySelector('#mainTargetDiv')

const navTitleH1 =
    document.querySelector('#navTitle h1')

// ---------------------------------------------------
// Inject HTML Into Main Target
// ---------------------------------------------------

export async function injectFromHref(hrefOrEl) {

    if (!hrefOrEl) return

    let href = hrefOrEl

    // Allow:
    // injectFromHref(linkElement)
    // injectFromHref('path/file.html')

    if (hrefOrEl instanceof Element) {

        href =
            hrefOrEl.href ||
            hrefOrEl.getAttribute('href') ||
            hrefOrEl.dataset.href
    }

    if (!href) return

    try {

        const response = await fetch(href)

        if (!response.ok) {
            throw new Error('Failed to fetch content')
        }

        const html = await response.text()

        mainTargetDiv.innerHTML = html

        updateLessonTitle()

        initializeInjectedContent()

    } catch (err) {

        console.error(err)

        mainTargetDiv.innerHTML = `
            <div class="inject-error">
                Failed to load content.
            </div>
        `
    }
}

// ---------------------------------------------------
// Restore Features After Injection
// ---------------------------------------------------

function initializeInjectedContent() {

    mainTargetDiv.scrollTo(0, 0)

    refreshImages(mainTargetDiv)

    initCopyCode()

    updateSteps()

    initAllVideos(mainTargetDiv)

    focusAutoFocusElement()
}

// ---------------------------------------------------
// Update Top Nav Lesson Title
// ---------------------------------------------------

function updateLessonTitle() {

    const lessonTitle =
        mainTargetDiv.querySelector('#lessonTitle')

    if (!lessonTitle) return

    navTitleH1.innerText =
        lessonTitle.innerText
}

// ---------------------------------------------------
// Auto Focus
// ---------------------------------------------------

function focusAutoFocusElement() {

    const autoFocusEl =
        mainTargetDiv.querySelector('[data-auto-focus]')

    if (!autoFocusEl) return

    requestAnimationFrame(() => {

        autoFocusEl.focus()

        autoFocusEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
    })
}