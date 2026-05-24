// import { denlargeAllImages } from "./toggle-img-sizesOG"
// toggle-img-sizes.js
// toggle-img-sizes.js

let allMedia = []

export function refreshImages(root = document) {
    allMedia = [
        ...root.querySelectorAll('.step-img'),
        ...root.querySelectorAll('.step-vid')
    ]
}

export function denlargeAllImages() {
    allMedia.forEach(el => {
        el.classList.remove('enlarge')
    })
}

/**
 * SHIFT + ENTER cycling
 */
export function handleImgSizes({ e }) {

    const key = e.key.toLowerCase()

    if (!(key === 'enter' && e.shiftKey)) return

    const step = e.target.closest('.step-float')

    if (!step) return

    cycleMedia(step)
}

/**
 * Keyboard cycle behavior
 */
function cycleMedia(step) {

    const items = [
        ...step.querySelectorAll('.step-img'),
        ...step.querySelectorAll('.step-vid')
    ]

    if (!items.length) return

    const stateKey = 'mediaIndex'

    let index = Number(step.dataset[stateKey] ?? -1)

    items.forEach(el => {
        el.classList.remove('enlarge')
    })

    // SINGLE ITEM
    if (items.length === 1) {

        if (index === -1) {
            items[0].classList.add('enlarge')
            step.dataset[stateKey] = 0
        } else {
            step.dataset[stateKey] = -1
        }

        return
    }

    // MULTI ITEM
    index++

    if (index >= items.length) {
        step.dataset[stateKey] = -1
        return
    }

    items[index].classList.add('enlarge')

    step.dataset[stateKey] = index
}

/**
 * CLICK behavior
 */
export function clickToggleImgSize(target) {

    if (!target) return

    const media =
        target.classList?.contains('step-img') ||
            target.classList?.contains('step-vid')
            ? target
            : target.closest('.step-img, .step-vid')

    if (!media) return

    media.classList.toggle('enlarge')
}