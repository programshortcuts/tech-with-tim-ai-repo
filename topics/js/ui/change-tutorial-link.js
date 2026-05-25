// change-tutorial-link.js
// change-tutorial-link.js

export const tutorialLink =
    document.querySelector('#tutorialLink')

export function syncTutorialLinkFromElement(el) {

    if (!el) return

    const vidBase = el.getAttribute("data-video")
    const ts = el.getAttribute("data-timestamp")

    if (!vidBase) return

    let vidHref = vidBase

    if (ts) {
        vidHref += (vidBase.includes("?") ? "&" : "?") + `t=${ts}s`
    }

    tutorialLink.href = vidHref
}