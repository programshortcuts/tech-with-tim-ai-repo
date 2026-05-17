import { denlargeAllImages } from "./toggle-img-sizesOG"
let allStepImgs = []
let allStepVids = []
// toggle-img-sizes.js
export function refreshImages(root = mainTargetDiv){
    allStepImgs = root.querySelectorAll('.step-img > img, .step-imgs > vid')
    allStepVids = root.querySelectorAll('.step-img > img, .step-imgs > vid')
    // resetImageState()

}
export function handleImgSizes({key,e}){

}

export function denlargeAllImages(){
    allImgs.forEach(el => {
        el.classList.remove('enlarge')
    })
}