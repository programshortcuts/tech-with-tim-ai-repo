import { mainContainer, navLessonTitle, sideBar, sideBarBtn } from '../core/elements.js';
export { sideBar, sideBarBtn };
let initialized = false;

export function setSidebarExpanded(expanded) {
    mainContainer?.classList.toggle('collapsed', !expanded);
    sideBarBtn?.setAttribute('aria-expanded', String(expanded));
    navLessonTitle?.setAttribute('aria-expanded', String(expanded));
    const links = sideBar?.querySelector('.side-bar-links-container');
    if (links) links.inert = !expanded;
}

export function initToggleSideBar() {
    if (initialized || !mainContainer || !sideBarBtn) return;
    initialized = true;
    setSidebarExpanded(!mainContainer.classList.contains('collapsed'));
    function toggle(e) {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.type === 'keydown' && !['Enter', ' '].includes(e.key)) return;
        e.preventDefault();
        setSidebarExpanded(mainContainer.classList.contains('collapsed'));
    }
    [sideBarBtn, navLessonTitle].filter(Boolean).forEach(el => {
        el.setAttribute('role', 'button');
        el.setAttribute('aria-controls', 'module-sidebar-links');
        el.addEventListener('click', toggle);
        el.addEventListener('keydown', toggle);
    });
    sideBar?.addEventListener('click', e => {
        if (e.target !== sideBar) return;
        sideBarBtn.focus();
        toggle(e);
    });
}
