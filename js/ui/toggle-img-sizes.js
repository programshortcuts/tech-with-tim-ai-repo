// import { denlargeAllImages } from "./toggle-img-sizesOG"
let allStepImgs = []
let allStepVids = []
// toggle-img-sizes.js
export function refreshImages(root = mainTargetDiv){
    allStepImgs = root.querySelectorAll('.step-.step-img > img, .step-imgs > vid')
    allStepVids = root.querySelectorAll('.step-.step-img > img, .step-imgs > vid')
    // resetImageState()
}
export function handleImgSizes({e}){
    const step = e.target.closest('.step-float')
    if(e.type === 'click'){
        console.log('click')
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
function toggleImgSize(step) {
    const imgsContainer = step.querySelector('.imgs-container')
    if(imgsContainer){
        const imgs = imgsContainer.querySelectorAll('.step-img,.step-vid')
        console.log(imgs)
        return
    }
    const stepImgVid = step.querySelector('.step-img') ?
        step.querySelector('.step-img') :
        step.querySelector('.step-vid')

    stepImgVid.classList.toggle("enlarge");
    // img.style.zIndex = img.classList.contains("enlarge") ? 100 : 0;
} 
export function denlargeAllImages(){
    allStepImgs.forEach(el => {
        el.classList.remove('enlarge')
    })
    allStepVids.forEach(el => {
        el.classList.remove('enlarge')
    })
}