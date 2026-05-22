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
    const key = e.key.toLowerCase()
    const stepImgs = step.querySelectorAll('.step-img')        
    
    if(e.target.classList.contains('copy-code')){
        if(key === 'enter' || 
            key === 'enter' && e.shiftKey
        ){
            console.log(iImg)
            toggleImgSize(stepImgs[iImg])
            if(stepImgs.length <= 1){
                iImg = 0
            } else {
                iImg = (iImg + 1) % stepImgs.length 
            }
            
        }
        return

    }
    if (e.shiftKey && key === 'enter') {
        console.log(iImg)
        toggleImgSize(stepImgs[iImg])
        if(stepImgs <= 1){
            iImg = 0
        } else {
            iImg = (iImg + 1) % stepImgs.length 
        }
        
        return
    }
    
    
}
export function toggleImgSize(stepImg) {
    if(!stepImg) return
    stepImg.classList.toggle('enlarge')
} 
export function clickToggleImgSize(img) {
    toggleImgSize(img)
} 
export function denlargeAllImages(){
    allStepImgs.forEach(el => {
        el.classList.remove('enlarge')
    })
    allStepVids.forEach(el => {
        el.classList.remove('enlarge')
    })
}