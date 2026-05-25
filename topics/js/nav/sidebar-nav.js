// sidebar-nav.js
// sidebar-nav.js
import { handleGlobalHeaderKeys } from "./global-header-keys.js"
import {
    setLastFocusedLink,
    getLastFocusedLink,
    setLastCLICKEDLink,
    getLastCLICKEDLink
} from "./sidebar-state.js"

import {
    injectFromHref,
    mainTargetDiv
} from "../core/inject-content.js"

import { sideBarBtn } from "../ui/toggle-sidebar.js"
import { syncTutorialLinkFromElement } from "../ui/change-tutorial-link.js"
export function sideBarNav({ e, navState }) {
    const handled = handleSideBarKeyDown(e)

    return handled ?? true
}
// ---------------------------------------------------
// Always Get Fresh Sidebar Links
// ---------------------------------------------------

export function getSideBarLinks() {

    return [
        ...document.querySelectorAll(
            '.side-bar-links-container a'
        )
    ]
}

// ---------------------------------------------------
// Sidebar Index
// ---------------------------------------------------

let currentIndex = 0

// ---------------------------------------------------
// Init Sidebar
// ---------------------------------------------------

export function initSideBarListeners() {

    const sideBar =
        document.querySelector('.side-bar-links-container')

    if (!sideBar) return

    setupAutoFocus()

    sideBar.addEventListener(
        'click',
        handleSideBarClick
    )

    sideBar.addEventListener(
        'keydown',
        handleSideBarKeyDown
    )

    sideBar.addEventListener(
        'focusin',
        handleFocusIn
    )
}

// ---------------------------------------------------
// Auto Focus Startup Link
// ---------------------------------------------------

function setupAutoFocus() {

    const links = getSideBarLinks()

    links.forEach((link, i) => {

        if (!link.hasAttribute('autofocus')) return

        currentIndex = i

        setLastFocusedLink(link)

        setLastCLICKEDLink(link)

        injectFromHref(link)

        requestAnimationFrame(() => {
            link.focus()
        })
    })
}

// ---------------------------------------------------
// Sidebar Click
// ---------------------------------------------------

function handleSideBarClick(e) {

    const link = e.target.closest('a')

    if (!link) return

    e.preventDefault()

    activateLink(link)
}

// ---------------------------------------------------
// Sidebar Keyboard Nav
// ---------------------------------------------------

function handleSideBarKeyDown(e) {

    const key = e.key.toLowerCase()

    // -----------------------
    // Forward Navigation
    // -----------------------

    if (key === 'f') {

        e.preventDefault()

        focusNextLink()

        return
    }

    // -----------------------
    // Backward Navigation
    // -----------------------

    if (key === 'a') {

        e.preventDefault()

        focusPreviousLink()

        return
    }

    // -----------------------
    // Activate Link
    // -----------------------

    if (key === 'enter') {

        const link = e.target.closest('a')

        if (!link) return

        e.preventDefault()

        activateLink(link)

        return
    }

    // -----------------------
    // Sidebar Button Focus
    // -----------------------

    if (key === 's') {

        sideBarBtn?.focus()

        return
    }

    // -----------------------
    // Main Content Focus
    // -----------------------

    if (key === 'm') {

        mainTargetDiv.focus()

        mainTargetDiv.scrollIntoView({
            behavior: 'instant',
            block: 'start'
        })
    }
    return false
}

// ---------------------------------------------------
// Track Focus
// ---------------------------------------------------

function handleFocusIn(e) {

    const link = e.target.closest('a')

    if (!link) return

    const links = getSideBarLinks()

    currentIndex = links.indexOf(link)

    setLastFocusedLink(link)
}

// ---------------------------------------------------
// Activate Link
// ---------------------------------------------------

async function activateLink(link) {

    if (!link) return

    const previousLink =
        getLastCLICKEDLink()

    await injectFromHref(link)

    setLastCLICKEDLink(link)
    // Update the top tutorial link immediately to match this sidebar item
    try {
        syncTutorialLinkFromElement(link)
    } catch (err) {
        // ignore errors updating tutorial link
    }

    setLastFocusedLink(link)

    // -----------------------
    // Re-focus Main Content
    // -----------------------

    if (previousLink === link) {

        mainTargetDiv.focus()

        mainTargetDiv.scrollTo(0, 0)

        window.scrollTo(0, 0)
    }
}

// ---------------------------------------------------
// Focus Next Link
// ---------------------------------------------------

function focusNextLink() {

    const links = getSideBarLinks()

    if (!links.length) return

    currentIndex =
        (currentIndex + 1) % links.length

    links[currentIndex].focus()
}

// ---------------------------------------------------
// Focus Previous Link
// ---------------------------------------------------

function focusPreviousLink() {

    const links = getSideBarLinks()

    if (!links.length) return

    currentIndex =
        (currentIndex - 1 + links.length)
        % links.length

    links[currentIndex].focus()
}