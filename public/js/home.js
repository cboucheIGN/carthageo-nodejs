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


// scroll
const scrollBtn = document.getElementById('go-to-header');
scrollBtn.style.display = 'none';

window.addEventListener('scroll', function(event) {
    console.log('event scroll', event);
    var y = window.scrollY;
    if (y > 200) {
        scrollBtn.style.display = 'block';
    } else {
        scrollBtn.style.display = 'none';
    }
});
