// nav-lessons-title-nav.js
// nav-lessons-title-nav.js

import { mainTargetDiv }
    from "../core/inject-content.js"

import { mainContainer }
    from "../core/main-script.js"

import {
    getSteps,
    getLastStep
} from "./step-nav.js"

export const navLessonTitle =
    document.querySelector('.nav-lesson-title')

// ---------------------------------------------------
// Always Get Fresh Sidebar Links
// ---------------------------------------------------

function getSideBarLinks() {

    return [
        ...document.querySelectorAll(
            '.side-bar-links-container a'
        )
    ]
}

// ---------------------------------------------------
// Nav Lesson Title Keyboard Logic
// ---------------------------------------------------

export function handleNavLessonTitle({
    e,
    navState
}) {

    const key =
        e.key.toLowerCase()

    const {
        zone,
        isLetterNavEnable
    } = navState

    if (zone !== 'navLessonTitle')
        return false

    // -----------------------
    // Focus Main Content
    // -----------------------

    if (key === 'm') {

        mainTargetDiv.focus()

        scrollTo(0, 0)

        return true
    }

    // -----------------------
    // Forward Navigation
    // -----------------------

    if (key === 'f') {

        // -------------------
        // Sidebar Open
        // -------------------

        if (
            !mainContainer.classList.contains(
                'collapsed'
            )
        ) {

            const links =
                getSideBarLinks()

            if (links.length) {
                links[0].focus()
            }

        }

        // -------------------
        // Sidebar Collapsed
        // -------------------

        else {

            const steps =
                getSteps()

            const lastStep =
                getLastStep()

            if (lastStep) {

                lastStep.focus()

            } else if (steps.length) {

                steps[0].focus()
            }

            return true
        }
    }

    return false
}