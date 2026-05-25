// global-header-keys.js
export function handleGlobalHeaderKeys(key, e) {

    // Tutorial
    if (key === 't') {
        const el = document.querySelector('#tutorialLink')
        if (el) {
            e.preventDefault()
            el.focus()
            // Do NOT auto-click the tutorial link on focus. Open only on explicit Enter or click.
            return true
        }
    }

    // Dark mode
    if (key === 'd') {
        const el = document.querySelector('#darkModeBtn')
        if (el) {
            e.preventDefault()
            el.focus()
            el.click?.()
            return true
        }
    }

    // Page header link map (optional)
    const headerLink =
        document.querySelector(
            `.page-header-links a[data-key="${key}"]`
        )

    if (headerLink) {
        e.preventDefault()
        headerLink.focus()
        headerLink.click?.()
        return true
    }

    return false
}