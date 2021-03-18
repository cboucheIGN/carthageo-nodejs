// button anchor
const anchorButtons = document.getElementsByClassName('btn-anchor');

for(var i = 0; i < anchorButtons.length; i++) {
    const btn = anchorButtons[i];
    btn.addEventListener('click', function(e) {
        const id = e.target.getAttribute('data-id');
        document.getElementById(id).scrollIntoView({
            behavior: 'smooth'
        });
    }, false);
}
