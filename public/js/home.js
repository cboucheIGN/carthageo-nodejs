//
const WITH_TIME = true;

// button anchor
const anchorButtons = document.getElementsByClassName('btn-anchor');

for(let i = 0; i < anchorButtons.length; i++) {
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
    const y = window.scrollY;
    if (y > 200) {
        scrollBtn.style.display = 'block';
    } else {
        scrollBtn.style.display = 'none';
    }
});


// tirage au sort
const groups = [
    { name: 'WWWaW', students: [{ name: 'Mehdi' }, { name: 'Maggie'}] },
    { name: '', students: [{ name: 'Mamadou' }, { name: 'Marcus'}] },
    { name: 'Olympics et pics et colégram', students: [{ name: 'François' }, { name: 'Hajime'}] },
    { name: 'Les Divinités Olympiennes', students: [{ name: 'Clemence' }, { name: 'Capucine'}] },
    { name: 'Cart\'Olympics', students: [{ name: 'Tanya' }, { name: 'Nina'}] },
    { name: '', students: [{ name: 'Ludovic' }, { name: 'Young Mi'}] },
];
const getRandomGroups = function(groups) {
    for (let i = groups.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [groups[i], groups[j]] = [groups[j], groups[i]];
    }
    return groups;
}
const getGroupsHtml = function(groups, withTime) {
    const groupHtml = groups.map((group, index) => {
        const names = group.students.map((s) => s.name).join(' & ');
        const name = group.name ? `${group.name} :` : '';
        let time = '';
        if (withTime) {
            time =`
              Passage à ${moment('2021-03-19 14:30').add(20*(index), 'minutes').format('HH:mm')}
            `;
        }
        return `
            <li><span class="bold">${name}</span> ${names}. <span class="italic">${time}</span></li>
        `;
    }).join('');
    return groupHtml;
}

const beginElement = document.getElementById('students');
beginElement.innerHTML = `<ul>${getGroupsHtml(groups)}</ul>`;

const resultElement = document.getElementById('result');
resultElement.innerHTML = `<ul class="ordre blur">${getGroupsHtml(groups, WITH_TIME)}</ul>`;

const sortBtn = document.getElementById('sort');
let start = false;
sortBtn.addEventListener('click', function(event) {
    if (start) {
        start = false;
        sortBtn.innerHTML = 'Tirage au sort';
        return;
    }
    start = true;
    sortBtn.innerHTML = 'STOP !';
    const refreshGroup = setInterval(() => {
        const rndGroups = getRandomGroups(groups);
        resultElement.innerHTML = `<ul class="ordre blur">${getGroupsHtml(rndGroups, WITH_TIME)}</ul>`;
        if(!start) {
            clearInterval(refreshGroup);
        }
    }, 1000);
}, false);


const displayTime = function(duration) {
    const str =  `
        Début des épreuves dans ${duration.hours()}:${duration.minutes()}:${duration.seconds()}
    `
    return str;
}

const eventTime = moment('2021-03-19 14:00');
const currentTime = moment();
const diffTime = eventTime.diff(currentTime);
let duration = moment.duration(diffTime, 'milliseconds');
const element = document.getElementById('countdown');
element.innerHTML = displayTime(duration);

console.log('diffTime', diffTime, 'eventTime', eventTime, 'currentTime', currentTime, 'duration', duration);

const interval = 1000;
setInterval(function(){
    duration = moment.duration(duration - interval, 'milliseconds');
    element.innerHTML = displayTime(duration);
}, interval);
