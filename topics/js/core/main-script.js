// main-script.js
// main-script.js

import { initDarkMode } from "../dark-mode.js"

import { keyboardNav }
    from "../nav/keyboard-nav.js"

import { initToggleSideBar }
    from "../ui/toggle-sidebar.js"

import { initSideBarListeners }
    from "../nav/sidebar-nav.js"

import { initStepNav }
    from "../nav/step-nav.js"

import { initCopyCode }
    from "../ui/copy-code.js"

// ---------------------------------------------------
// Global Layout References
// ---------------------------------------------------

export const pageWrapper =
    document.querySelector('.page-wrapper')

export const mainContainer =
    document.querySelector('.main-container')

// ---------------------------------------------------
// App Startup
// ---------------------------------------------------

window.addEventListener(
    'DOMContentLoaded',
    initMain
)

function initMain() {

    // -----------------------
    // Initial Features
    // -----------------------

    initCopyCode()

    initDarkMode()

    initToggleSideBar()

    initSideBarListeners()

    initStepNav()

    // -----------------------
    // Global Keyboard System
    // -----------------------

    setupGlobalKeyListener()
}

// ---------------------------------------------------
// Global Keyboard Listener
// ---------------------------------------------------

function setupGlobalKeyListener() {

    addEventListener('keydown', e => {

        // -----------------------
        // Ignore Prevented Events
        // -----------------------

        if (e.defaultPrevented) return

        // -----------------------
        // Ignore Typing Fields
        // -----------------------

        const tag = e.target.tagName

        const isTyping =

            tag === 'INPUT' ||

            tag === 'TEXTAREA' ||

            e.target.isContentEditable

        if (isTyping) return

        // -----------------------
        // Main Keyboard Router
        // -----------------------

        keyboardNav({ e })
    })
}