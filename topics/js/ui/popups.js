export const popElLetterNav = document.querySelector('#popElLetterNav')

export function popupLetterNav({ e, navState }) {
    // Navigation Mode
    if (e.key === 'x' && e.shiftKey && e.metaKey) {
        navState.isLetterNavEnabled = !navState.isLetterNavEnabled
        popElLetterNav.innerText = `letter navigation : ${navState.isLetterNavEnabled}`
        popElLetterNav.classList.add('animate')
        document.querySelector('.page-wrapper').classList.toggle('nav-mode-colors')
        setTimeout(() => {
            popElLetterNav.classList.remove('animate')
        }, 1000);
        console.log('go')
        return
    }
}