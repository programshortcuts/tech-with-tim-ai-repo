// keyboard-nav.js
/**  Notice what changed:
👉 keyboardNav no longer decides behavior
It just updates truth.
*/
// keyboard-nav.js
import { handleGlobalHeaderKeys } from "./global-header-keys.js"
import { mainContainer }
    from "../core/main-script.js"

import { navLessonTitle }
    from "./nav-lesson-title-nav.js"

import { getFocusZone }
    from "./get-focus-zone.js"

import { popupLetterNav }
    from "../ui/popups.js"

import { letterNav }
    from "./letter-nav.js"

import { sideBarNav }
    from "./sidebar-nav.js"

import { handleNavLessonTitle }
    from "./nav-lesson-title-nav.js"

import {
    getLastStep
} from "./step-nav.js"

import {
    mainTargetDiv
} from "../core/inject-content.js"

import {
    getLastCLICKEDLink,
    getLastFocusedLink
} from "./sidebar-state.js"

import {
    sideBarBtn
} from "../ui/toggle-sidebar.js"

import {
    stepNav
} from "./step-nav.js"

// ---------------------------------------------------
// Navigation State
// ---------------------------------------------------

export const navState = {
    zone: null,
    isLetterNavEnabled: false
}

// ---------------------------------------------------
// Main Keyboard Router
// ---------------------------------------------------

export function keyboardNav({ e }) {

    navState.zone = getFocusZone({ e })

    if (!navState.zone) return

    // -----------------------------------------
    // Toggle Letter Navigation Mode
    // -----------------------------------------

    if (
        e.key === 'x' &&
        e.shiftKey &&
        e.metaKey
    ) {
        toggleLetterNavMode()
        return
    }

    // -----------------------------------------
    // Global Keys (always available)
    // -----------------------------------------

    const key = e.key.toLowerCase()

    if (key === 's') {
        sideBarBtn?.focus()
    }

    routeKey({ e })
}

// ---------------------------------------------------
// Letter Nav Toggle
// ---------------------------------------------------

function toggleLetterNavMode() {

    navState.isLetterNavEnabled =
        !navState.isLetterNavEnabled

    popupLetterNav.innerText =
        `letter navigation : ${navState.isLetterNavEnabled}`

    popupLetterNav.classList.add('animate')

    document.querySelector('.page-wrapper')
        .classList
        .toggle('nav-mode-colors')

    setTimeout(() => {
        popupLetterNav.classList.remove('animate')
    }, 1000)
}

// ---------------------------------------------------
// Route Key to Zone Handlers
// ---------------------------------------------------

function routeKey({ e }) {

    const { zone, isLetterNavEnabled } = navState

    const key = e.key.toLowerCase()
    if (handleGlobalHeaderKeys(key, e)) return
    // -------------------------
    // Main focus shortcut
    // -------------------------

    if (key === 'm') {
        handleMainFocus({ e, zone })
        return
    }

    // -------------------------
    // Sidebar focus shortcut
    // -------------------------

    if (key === 's') {
        handleSidebarFocus({ e, zone })
        return
    }

    // -------------------------
    // Letter nav mode overrides everything
    // -------------------------

    if (isLetterNavEnabled) {
        letterNav({ e })
        return
    }

    // -------------------------
    // Zone-based routing
    // -------------------------

    if (zone === 'navLessonTitle') {
        const handled =
            handleNavLessonTitle({ e, navState })

        if (handled) return
    }

    if (zone === 'mainTargetDiv') {
        const handled =
            stepNav({ e, navState })

        if (handled) return
    }

    if (zone === 'sideBar') {
        const handled =
            sideBarNav({ e, navState })

        if (handled) return
    }

    // fallback
    letterNav({ e })
}

// ---------------------------------------------------
// Main Focus Handler
// ---------------------------------------------------

function handleMainFocus({ e, zone }) {

    const key = e.key.toLowerCase()
    // ---------------------------------------------------

    if (handleGlobalHeaderKeys(key, e)) return

    // NOW safe to compute zone
    navState.zone = getFocusZone({ e })

    if (!navState.zone) return
    const lastStep =
        getLastStep()

    if (zone !== 'sideBar') {
        mainTargetDiv.focus()
    }

    if (zone === 'mainTargetDiv') {

        if (lastStep) {

            if (e.target === lastStep) {

                mainTargetDiv.focus()

                document
                    .querySelector('body')
                    .scrollIntoView({
                        behavior: 'instant',
                        block: 'start'
                    })

            } else {

                lastStep.focus()

                lastStep.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
        }

        return
    }

    if (e.target !== mainTargetDiv && key === 'm') {

        if (lastStep) {

            lastStep?.focus()

        } else {

            mainTargetDiv.focus()

            document
                .querySelector('body')
                .scrollIntoView({
                    behavior: 'instant',
                    block: 'start'
                })
        }

        return
    }

    mainTargetDiv.focus()

    document
        .querySelector('body')
        .scrollIntoView({
            behavior: 'instant',
            block: 'start'
        })
}

// ---------------------------------------------------
// Sidebar Focus Handler
// ---------------------------------------------------

function handleSidebarFocus({ e, zone }) {

    const lastLink =
        getLastFocusedLink()

    const lastClicked =
        getLastCLICKEDLink()

    if (zone === 'sideBar') {

        if (e.target === sideBarBtn) {

            if (lastClicked) {
                lastClicked.focus()

            } else if (lastLink) {
                lastLink.focus()
            }
        }

        return
    }

    if (lastLink || lastClicked) {

        sideBarBtn.focus()

        return
    }

    if (mainContainer.classList.contains('collapsed')) {

        sideBarBtn?.focus()

    } else {

        lastClicked?.focus()
    }
}
