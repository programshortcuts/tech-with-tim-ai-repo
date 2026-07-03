const dropDowns = document.querySelectorAll('.drop-down')
const allDropSnips = document.querySelectorAll('.drop-snips')
dropDowns.forEach(el => {
    el.addEventListener('keydown', (e) => {

        const key = e.key.toLowerCase()
        if(key === 'enter'){
            const dropParent = e.target.closest('.drop-parent')
            const dropSnips = dropParent.querySelector('.drop-snips')
            
            toggleDrop(dropSnips)
        }
    });
})
function toggleDrop(dropSnips){
    dropSnips.classList.toggle('hide')

}
function collapseAll(els){
    els.forEach(el => {
        if(el.classList.contains('show')){
            // el.classList.add('hide')
            el.classList.remove('show')
        } else {
            el.classList.add('hide')
            
        }
    })
}
collapseAll(allDropSnips)