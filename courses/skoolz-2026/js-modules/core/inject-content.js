import { mainTargetDiv, navLessonTitle, sideBar, endNxtBtn, prevBtn } from './elements.js';
import { lessonURL, prepareContent } from './content-paths.js';
import { getLastCLICKEDLink, setLastCLICKEDLink } from '../nav/sidebar-state.js';
import { updateSteps } from '../nav/step-nav.js';
import { refreshImages } from '../ui/toggle-img-sizes.js';
import { initCopyCode } from '../ui/copy-code.js';
import { initAllVideos } from '../ui/video-controls.js';
import { changeTutorialLink } from '../ui/change-tutorial-link.js';
import { setSidebarExpanded } from '../ui/toggle-sidebar.js';
import { getSidebarSubmenu, revealSidebarLink, setDropdownExpanded } from '../ui/sidebar-dropdowns.js';
export { mainTargetDiv, endNxtBtn, prevBtn };

let initialized = false;
let request = null;
const sidebarLinks = () => [...sideBar.querySelectorAll('.side-bar-links a[href]')];
const homeHref = () => mainTargetDiv.dataset.href || 'homepage.html';

export async function injectFromHref(href, sourceLink = null) {
    if (!href || !mainTargetDiv) return null;
    request?.abort();
    const current = new AbortController();
    request = current;
    mainTargetDiv.setAttribute('aria-busy', 'true');
    let url;
    let failed = false;
    async function load(path) {
        const target = lessonURL(path);
        const response = await fetch(target, { signal: current.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return { url: target, nodes: prepareContent(await response.text(), target) };
    }
    try {
        let result;
        try {
            result = await load(href);
        } catch (error) {
            if (current.signal.aborted) return null;
            failed = true;
            result = await load(homeHref());
        }
        if (current.signal.aborted) return null;
        url = result.url.href;
        mainTargetDiv.querySelectorAll('video').forEach(video => video.pause());
        mainTargetDiv.replaceChildren(...result.nodes);
        mainTargetDiv.dataset.loadedHref = url;
        if (failed) {
            const notice = document.createElement('p');
            notice.setAttribute('role', 'status');
            notice.textContent = 'This lesson is unavailable. Showing the module homepage.';
            mainTargetDiv.prepend(notice);
        }
        const title = mainTargetDiv.querySelector('#lessonTitle');
        if (title && navLessonTitle) navLessonTitle.querySelector('h1').textContent = title.textContent.trim();
        mainTargetDiv.scrollTo(0, 0);
        refreshImages(mainTargetDiv);
        updateSteps();
        initCopyCode(mainTargetDiv);
        initAllVideos(mainTargetDiv);
        const loadedLink = sourceLink?.href === url ? sourceLink : sidebarLinks().find(link => link.href === url);
        setLastCLICKEDLink(loadedLink || null);
        changeTutorialLink({ target: loadedLink || mainTargetDiv });
        return { url, failed };
    } catch (error) {
        if (current.signal.aborted) return null;
        const notice = document.createElement('p');
        notice.setAttribute('role', 'alert');
        notice.textContent = 'Unable to load this module. Choose a lesson to try again.';
        mainTargetDiv.replaceChildren(notice);
        delete mainTargetDiv.dataset.loadedHref;
        updateSteps();
        setLastCLICKEDLink(null);
        return null;
    } finally {
        if (request === current) mainTargetDiv.removeAttribute('aria-busy');
    }
}

async function activateSidebarLink(link, { toggleDropdown = true } = {}) {
    const repeated = getLastCLICKEDLink() === link;
    revealSidebarLink(link);
    const submenu = getSidebarSubmenu(link);
    if (toggleDropdown && submenu) setDropdownExpanded(link, submenu.classList.contains('hide'));
    // Focus, not fetch completion, owns the visible sidebar selection.
    link.focus({ preventScroll: true });
    link.scrollIntoView({ block: 'nearest' });
    const result = await injectFromHref(link.href, link);
    if (!result || document.activeElement !== link) return;
    if (result.failed) {
        sidebarLinks().find(item => item.href === result.url)?.focus();
    } else if (repeated) {
        (mainTargetDiv.querySelector('.step-float') || mainTargetDiv).focus({ preventScroll: true });
    } else {
        mainTargetDiv.querySelector('[data-auto-focus]')?.focus();
    }
}

function navigateLesson(direction) {
    const links = sidebarLinks();
    if (!links.length) return;
    const index = links.indexOf(getLastCLICKEDLink());
    const start = index < 0 ? (direction > 0 ? -1 : 0) : index;
    setSidebarExpanded(true);
    activateSidebarLink(links[(start + direction + links.length) % links.length]);
}

export function initInjectContentListeners() {
    if (initialized || !mainTargetDiv || !sideBar) return;
    initialized = true;
    sideBar.addEventListener('click', e => {
        const link = e.target.closest('.side-bar-links a[href]');
        if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        activateSidebarLink(link);
    });
    // Native Enter on anchors emits a click; no competing keydown injector.
    endNxtBtn?.addEventListener('click', () => navigateLesson(1));
    prevBtn?.addEventListener('click', () => navigateLesson(-1));
    mainTargetDiv.addEventListener('click', e => {
        const link = e.target.closest('a[href^="#"]');
        if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const target = document.getElementById(link.getAttribute('href').slice(1));
        if (target && sideBar.contains(target) && target.matches('a[href]')) {
            e.preventDefault();
            setSidebarExpanded(true);
            activateSidebarLink(target);
        }
    });
    const autoLink = sidebarLinks().find(link => link.hasAttribute('autofocus'));
    if (autoLink) activateSidebarLink(autoLink, { toggleDropdown: false });
    else injectFromHref(homeHref()).then(result => {
        if (result && document.activeElement === document.body) {
            sidebarLinks().find(link => link.href === result.url)?.focus();
        }
    });
}
