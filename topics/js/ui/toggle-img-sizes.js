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
        
        // toggleImgSize(step)            
        return
    }
    if(e.target.classList.contains('copy-code')){
        // toggleImgSize(step)
    }
    
}
export function toggleImgSize(img) {
    console.log('here')
    console.log(img)
    img.classList.toggle('enlarge')
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