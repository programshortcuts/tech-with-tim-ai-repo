// copy-code.js
export function initCopyCode(root = document) {
    root.querySelectorAll('.copy-code').forEach(element => {
        if (element.dataset.copyCodeBound === 'true') return;
        element.dataset.copyCodeBound = 'true';

        element.addEventListener('keydown', e => {
            if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'c') return;
            e.preventDefault();
            copyElementText(element);
            animate(element);
        });

        element.addEventListener('click', e => {
            if (e.target.closest('a[href]')) return;

            e.preventDefault();
            e.stopPropagation();
            copyElementText(element);
            animate(element);
            element.closest('.step-float')?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        });
    });
}

function copyElementText(element) {
    const text = 'value' in element ? element.value : element.innerText;
    if (!text) return;

    navigator.clipboard.writeText(text).catch(error => {
        console.error('Unable to copy text to clipboard:', error);
    });
}

function animate(element) {
    element.classList.remove('copied');
    void element.offsetWidth;
    element.classList.add('copied');
    setTimeout(() => element.classList.remove('copied'), 250);
}
