const targetDivs = document.querySelectorAll('.section');

// Function to handle scroll event with debounce
function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
    };
}

// Function to handle URL change logic
function handleURLChange() {
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;

    // Loop through the target divs and check if they are in view
    targetDivs.forEach((div) => {
        const divTop = div.offsetTop;
        const divBottom = divTop + div.offsetHeight;

        // Check if the div is at least 50% in the viewport
        if (divTop <= viewportBottom - (div.offsetHeight * 0.5) && divBottom >= viewportTop + (div.offsetHeight * 0.5)) {
            const id = div.getAttribute('id');
            history.pushState({}, '', `/app/${id}`);
        }
    });
}

// Attach debounced scroll event listener to the window object
window.addEventListener('scroll', debounce(handleURLChange, 200));