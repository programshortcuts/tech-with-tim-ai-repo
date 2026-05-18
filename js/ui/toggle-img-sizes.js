// import { denlargeAllImages } from "./toggle-img-sizesOG"
let iImg = 0
let allStepImgs = []
let allStepVids = []
// toggle-img-sizes.js
export function refreshImages(root = mainTargetDiv){
    allStepImgs = root.querySelectorAll('.step-img , .step-vid')
    allStepVids = root.querySelectorAll('.step-img , .step-vid')
    // resetImageState()
}
export function handleImgSizes({e}){
    const step = e.target.closest('.step-float')
    
    if(e.type === 'click'){
        // this wont work here
        // toggleImgSize(step)            
        return
    }

    const key = e.key.toLowerCase()
    if (e.shiftKey && key === 'enter') {
        
        toggleImgSize(step)            
        return
    }
    if(e.target.classList.contains('copy-code')){
        toggleImgSize(step)
    }
    
}
export function toggleImgSize(step) {
    const imgsContainer = step.querySelector('.imgs-container')
    if(imgsContainer){
        const imgs = imgsContainer.querySelectorAll('.step-img,.step-vid')
        
        toggleImgSize(imgs[iImg])
        iImg += 1
        return
    }

    const stepImgVid = step.querySelector('.step-img') ?
        step.querySelector('.step-img') :
        step.querySelector('.step-vid')
    if(!stepImgVid) return
    stepImgVid.classList.toggle("enlarge");
} 
export function denlargeAllImages(){
    allStepImgs.forEach(el => {
        el.classList.remove('enlarge')
    })
    allStepVids.forEach(el => {
        el.classList.remove('enlarge')
    })
}