const video = document.getElementById('video');
const controls = document.querySelectorAll('.controls');
const controlsBottom = document.querySelector('.controls-bottom');
const slider = document.getElementById('slider');
const uiSlider = document.getElementsByClassName('noUi-connects');
const playButton = document.getElementById('playpause');
const playButtonReplay = playButton.querySelector('.replay');
const playButtonIcons = document.querySelectorAll('#playpause svg');
const playbackAnimation = document.getElementById('playback-animation');
const playbackIcons = playbackAnimation.querySelectorAll('svg');
const videoContainer = document.getElementById('video-container');
const videoSource = document.getElementById('video-source');

const url = window.location.href;
const source = new URL(url).searchParams.get('source');
const poster = new URL(url).searchParams.get('poster');

let hidingTimeout;

if (source) {
    videoSource.setAttribute('src', source);
    video.load();
}
if (poster) {
    video.setAttribute('poster', poster);
    video.load();
}

const videoWorks = !!document.createElement('video').canPlayType;

if (videoWorks) {
    video.controls = false;
    controls.forEach(con => {
        con.classList.remove('hidden');
    });
}

//moUiSlider
noUiSlider.create(slider, {
    start: [0],
    behaviour: 'drag-tap',
    step: 1,
    margin: 0,
    padding: 0,
    connect: 'lower',
    format: wNumb({
        decimals: 2,
    }),
    range: {
        'min': 0,
        'max': 100
    },
});

function initializeVideo() {
    const videoDuration = Math.round(video.duration);
    slider.noUiSlider.updateOptions({
        range: {
            'min': 0,
            'max': videoDuration
        },

    });
}

video.addEventListener('loadedmetadata', initializeVideo);

function togglePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function updatePlayButtonIcons() {
    let i;
    let length = playButtonIcons.length;
    for (i = 0; i < length; i++) {
        playButtonIcons[i].classList.add('hidden');
    }
    if (video.paused) {
        playButtonIcons[0].classList.remove('hidden');
        playButton.setAttribute('data-title', 'Play (k)');
    } else {
        playButtonIcons[1].classList.remove('hidden');
        playButton.setAttribute('data-title', 'Pause (k)');
    }
    togglePlaybackIcons();
}

function togglePlaybackIcons() {
    playbackIcons.forEach(icon => {
        icon.classList.toggle('hidden');
    })
}

playButton.addEventListener('click', togglePlay);
playbackAnimation.addEventListener('click', togglePlay);
playButton.addEventListener('click', updatePlayButtonIcons);
playbackAnimation.addEventListener('click', updatePlayButtonIcons);
video.addEventListener('click', togglePlay);
video.addEventListener('click', updatePlayButtonIcons);

function animatePlayBack() {
    playbackAnimation.animate([
        {
            opacity: 1,
            transform: "translate(-50%, -50%) scale(1)",
        },
        {
            opacity: 0,
            transform: "translate(-50%, -50%) scale(1.3)",
        }
    ], {
        duration: 500,
    })
}

video.addEventListener('click', animatePlayBack);


function showControls() {
    clearTimeout(hidingTimeout);
    controlsBottom.classList.remove('hidden');
}
function hideControls() {
    if (video.paused || video.ended) {
        return;
    }
    hidingTimeout = setTimeout(()=>{
        controlsBottom.classList.add('hidden');
    }, 4000);
}

video.addEventListener('mouseenter', showControls);
video.addEventListener('mouseleave', hideControls);
controlsBottom.addEventListener('mouseenter', showControls);
controlsBottom.addEventListener('mouseleave', hideControls);


function checkReplay() {
    if (video.ended || Math.floor(Number(slider.noUiSlider.get())) == 100) {
        playButtonIcons.forEach(icon => {
            icon.classList.add('hidden');
        });
        playButtonReplay.classList.remove('hidden');
        playButton.setAttribute('data-title', 'Replay (k)');
        setTimeout(()=>{
            slider.noUiSlider.set(0);
        }, 50);
    }
}


video.addEventListener('timeupdate', checkReplay);


function keyboardShortcuts(e) {
    switch (e.key) {
        case 'k': case 'K': case ' ': togglePlay(); updatePlayButtonIcons(); break;
        case 'ArrowLeft': video.currentTime -= 10; break;
        case 'ArrowRight': video.currentTime += 10; break;
        default: return;
    }
}

document.addEventListener('keyup', keyboardShortcuts);


slider.noUiSlider.on('change', (values, handle) => {
    video.currentTime = values[handle];
});
slider.noUiSlider.on('change', function () {
    slider.noUiSlider.set(this.value);
    checkReplay();
});

function updateProgress() {
    slider.noUiSlider.set(video.currentTime);
}

let currentTime = video.currentTime;
setInterval(() => {
    if (currentTime !== video.currentTime) {
        updateProgress();
    }
    currentTime = video.currentTime
}, 100);
