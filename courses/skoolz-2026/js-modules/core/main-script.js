import { keyboardNav } from '../nav/keyboard-nav.js';
import { initSideBarListeners } from '../nav/sidebar-nav.js';
import { initStepNav } from '../nav/step-nav.js';
import { initInjectContentListeners } from './inject-content.js';
import { initToggleSideBar } from '../ui/toggle-sidebar.js';
import { initDarkMode } from '../ui/dark-mode.js';
import { initHeaderScroll } from '../ui/header-scroll.js';
let initialized = false;
const pageWrapper = document.querySelector('.page-wrapper')
function initMain() {
    if (initialized) return;
    // Trying something different gonna consolidate step js script into the js-modules/steps/ directory
    // initStepListeners(pageWrapper)
    // 
    initialized = true;
    initSideBarListeners();
    initToggleSideBar();
    initStepNav();
    initDarkMode();
    initHeaderScroll();
    initInjectContentListeners();
    window.addEventListener('keydown', e => keyboardNav({ e }));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMain, { once: true });
else initMain();
