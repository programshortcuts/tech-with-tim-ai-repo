// step-nav.js
import { sideBarAs } from "../nav/sidebar-nav.js"
import { getLastCLICKEDLink } from "./sidebar-state.js"
import { mainTargetDiv } from "../core/inject-content.js"
import { changeTutorialLink } from "../ui/change-tutorial-link.js"
import { handleStepClickedNav, } from "./step-clicked-nav.js"
import { clickToggleImgSize, 
    refreshImages, 
    handleImgSizes,
    denlargeAllImages
 } from "../ui/toggle-img-sizes.js";
import { endNxtBtn,prevBtn } from "../core/inject-content.js"

// nonSideBarEls is an awfule way to do this but i'm desperate right now
let steps = []
let copyCodes = []
let iSteps = 0
let lastStep
let allImgs = []
let stepClicked = false
let iCopyCodes = 0
let stepCopyCodes = []
export function initStepNav(){{
    copyCodes = []
    // refreshImages(mainTargetDiv)
    // refreshImages()
    updateSteps()
    updateCopyCodes()
    
}}
export function removeALLSideLinkChange() {sideBarAs.forEach(el => el.classList.remove('sideLinkChange'))}
function handleLessonBtnsFocus(e){
    if(e.type === 'keydown'){
        let key = e.key.toLowerCase()
        
        if (key === 'a') {
            steps[steps.length - 1].focus()
        }
        if(key === 'enter'){
            removeALLSideLinkChange() 
            return
        }
    }
    if (e.type === 'click') {
        removeALLSideLinkChange()
        
    }
}
function updateCopyCodes() {
    const copyCodes = document.querySelectorAll('.copy-code')
    return copyCodes

}
export function getSteps(){return steps}
export function updateSteps(){
    steps = mainTargetDiv.querySelectorAll('.step-float')
    // I don't fully know why nonSideBarEls is working
    const sideBarEls = [...document.querySelectorAll('[id],a')].filter(el => {
        if(!el.closest('.side-bar'))
        return 
    })
    copyCodes = updateCopyCodes()
    copyCodes.forEach(el => {
        el.addEventListener('focusin', e => {
            console.log('here')
            console.log(e.target)
            denlargeAllImages(allImgs)
            document.querySelectorAll('.copy-code').forEach(c => {
                c.classList.remove('is-active-code');
            });

            e.target.classList.add('is-active-code');
        });
        el.addEventListener('focusout', e => {
            e.target.classList.remove('is-active-code');
        });
        el.addEventListener('keydown', e => {
            handleImgSizes({e})
        });
    })
    // This should not be here, this needs to get implemented into  toggle-img-sizes.js i think
    steps.forEach((el,i) => {
        if(el.hasAttribute('autofocus')){
            el.focus()
            lastStep = el
            iSteps = i
        }
        
        el.addEventListener('focus', e => {
            scrollToCenter({el})
            denlargeAllImages(allImgs)
            removeStepClicked(steps)            
            stepClicked = false
            iSteps = i
            iCopyCodes = 0
            lastStep = steps[iSteps]
            

        })
        el.addEventListener('click', e => {
            lastStep = steps[iSteps]
            // if(e.type != 'click') return
            
            if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO'){
                
                clickToggleImgSize(e.target)
            }
            scrollToCenter({el})
            changeTutorialLink(e)
        });
        el.addEventListener('mousedown', e => {
            lastStep = steps[iSteps]
            changeTutorialLink(e)
        });
        el.addEventListener('keydown', e => {
            let key = e.key.toLowerCase()
            const step = e.target.closest('.step-float')
            if(!step.classList.contains('step-float')) return
            
            if(key === 'enter'){
                stepClicked = true
                // handleImgSizes({e})
                handleStepClickedNav({e})
                changeTutorialLink(e)
            }
            
            if(key === 'm'){
                denlargeAllImages()
                mainTargetDiv.scrollTo(0,0)
            }
            if(key === 's'){
                denlargeAllImages()
            }
            
        });
    })
    
}


function stepFocus(index){
    if(index >= steps.length){
        index = steps.length -1
    }
    steps[index]?.focus()
}
export function getLastStep(){return lastStep}
function removeStepClicked(steps){steps.forEach(el => el.classList.remove('step-clicked'))}
export function scrollToCenter({el,smooth}){
    if(!el) return
    if(smooth){
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }else {
        el.scrollIntoView({ behavior: 'instant', block: 'center' })
    }
}
export function stepNav({ e, navState }) {
    if (navState.zone !== 'mainTargetDiv') return false
    const key = e.key.toLowerCase()
    const step = e.target.closest('.step-float')
    if (key === 'enter' && e.target === mainTargetDiv) {
        iSteps = 0
        steps[0].focus()
        scrollTo(0, 0)
        return true
    }
    if (stepClicked) {
        if (!step) return
        
        if (!step.classList.contains('step-clicked')) {
            step?.classList.add('step-clicked')
        }
        iCopyCodes = handleStepClickedNav({ e, iCopyCodes })
        // handleStepClickedNav({ e }) Don't run this it runs when initialized in declaration above
        return true
    }
    if (!isNaN(key)) {
        const intLet = parseInt(key)
        iSteps = steps[intLet - 1]
        if (intLet >= steps.length) iSteps = steps.length - 1
        if(!steps[intLet - 1]) return
        steps[intLet - 1].focus()
        return true
    }
    if (key === 'm') {
        mainTargetDiv.focus()
        mainTargetDiv.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
            // inline: 'nearest',
        })
        return true
    }
    if (key === 'a') {
        iSteps = (iSteps - 1 + steps.length) % steps.length
        stepFocus(iSteps)
        return true
    }
    if (key === 'f') {
        if (e.target === mainTargetDiv) {
            iSteps = 0
        } else {
            iSteps = (iSteps + 1) % steps.length
        }
        stepFocus(iSteps)
        return true
    }
    return false
}
