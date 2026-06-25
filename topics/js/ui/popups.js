export const popElLetterNav = document.querySelector('#popElLetterNav')

export function popupLetterNav({e,navState}) {
    // Navigation Mode
        if (e.key === 'x' && e.shiftKey && e.metaKey) {
            navState.isLetterNavEnabled = !navState.isLetterNavEnabled
            popupLetterNav.innerText = `letter navigation : ${navState.isLetterNavEnabled}`
            popupLetterNav.classList.add('animate')
            document.querySelector('.page-wrapper').classList.toggle('nav-mode-colors')
            setTimeout(() => {
                popupLetterNav.classList.remove('animate')
            }, 1000);
            console.log('go')
            return
        }
}