// import { denlargeAllImages } from "./toggle-img-sizesOG"
let allStepImgs = []
let allStepVids = []
// toggle-img-sizes.js
export function refreshImages(root = mainTargetDiv){
    allStepImgs = root.querySelectorAll('.step-img > img, .step-imgs > vid')
    allStepVids = root.querySelectorAll('.step-img > img, .step-imgs > vid')
    // resetImageState()

}
export function handleImgSizes({e}){
    if(e.type === 'click'){
        console.log('click')
        return
    }
    
    const key = e.key.toLowerCase()
    if (e.shiftKey && key === 'enter') {
        
    }
    if (!e.shiftKey && key === 'enter') {

        
    }
}

export function denlargeAllImages(){
    allStepImgs.forEach(el => {
        el.classList.remove('enlarge')
    })
    allStepVids.forEach(el => {
        el.classList.remove('enlarge')
    })
}