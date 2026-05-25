// sidebar-state.js

let lastFocusedLink = null
let lastClickedLink = null

// ---------------------------
// Focused Link
// ---------------------------

export function setLastFocusedLink(link) {
    lastFocusedLink = link
}

export function getLastFocusedLink() {
    return lastFocusedLink
}

export function clearLastFocusedLink() {
    lastFocusedLink = null
}

// ---------------------------
// Clicked / Activated Link
// ---------------------------

export function setLastCLICKEDLink(link) {
    lastClickedLink = link
}

export function getLastCLICKEDLink() {
    return lastClickedLink
}

export function clearLastCLICKEDLink() {
    lastClickedLink = null
}