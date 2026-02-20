export const debounce = (fn: () => void, delay: number) => {
    let timeout: number;

    return () => {
        clearTimeout(timeout);
        timeout = window.setTimeout(fn, delay);
    };
};
