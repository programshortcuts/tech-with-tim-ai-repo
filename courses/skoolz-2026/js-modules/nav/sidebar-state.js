import { sideBar } from '../core/elements.js';

let lastFocusedLink = null;
let lastClickedLink = null;

export function setLastFocusedLink(link) {
    if (!link || !sideBar?.contains(link)) return;
    lastFocusedLink = link;
    sideBar.querySelectorAll('.side-bar-links-container a').forEach(item => {
        const active = item === link;
        item.classList.remove('sideLinkChange', 'highlight', 'active');
        if (active) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
    });
}

export const getLastFocusedLink = () => lastFocusedLink;
export const getLastCLICKEDLink = () => lastClickedLink;
export function setLastCLICKEDLink(link) { lastClickedLink = link; }
export function clearLastCLICKEDLink() { lastClickedLink = null; }
export function clearLastFocusedLink() {
    lastFocusedLink = null;
    sideBar?.querySelectorAll('.side-bar-links-container a').forEach(link => {
        link.classList.remove('sideLinkChange', 'highlight', 'active');
        link.removeAttribute('aria-current');
    });
}
