// ui/steps-dropdowns.js

let initialized = false;

export function initStepsDropdowns() {
    if (initialized) return;
    initialized = true;

    document.addEventListener('click', e => {
        const button = e.target.closest(
            '.drop-steps-container > .drop-down'
        );

        if (!button) return;

        const parent = button.closest(
            '.drop-steps-container'
        );

        const dropdown =
            parent?.querySelector(
                ':scope > .drop-snips'
            );

        if (!dropdown) return;

        const opening =
            dropdown.classList.contains('hide');

        dropdown.classList.toggle(
            'hide',
            !opening
        );

        dropdown.inert = !opening;

        button.setAttribute(
            'aria-expanded',
            String(opening)
        );

        /*
        Important:
        Do not move focus here.
        The clicked button should remain focused.
        */
    });
    document.addEventListener('keydown', e => {
        const key = e.key.toLowerCase()

        if (key === 'enter') {
            const button = e.target.closest(
                '.drop-steps-container > .drop-down'
            );

            if (!button) return;

            const parent = button.closest(
                '.drop-steps-container'
            );

            const dropdown =
                parent?.querySelector(
                    ':scope > .drop-snips'
                );

            if (!dropdown) return;

            const opening =
                dropdown.classList.contains('hide');

            dropdown.classList.toggle(
                'hide',
                !opening
            );

            dropdown.inert = !opening;

            button.setAttribute(
                'aria-expanded',
                String(opening)
            );

            /*
            Important:
            Do not move focus here.
            The clicked button should remain focused.
            */
        }
    });
}