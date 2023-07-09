const canvas = document.getElementById('canvasMain');
const ctx = canvas.getContext('2d');
canvas.width = 1190;
canvas.height = 1684;

const imageInput = document.getElementById('upload');

function startForm() {
    const image = new Image();
    image.src = '../Sofo/Assets/defaultSheet.png';
    image.onload = function () {
        imageInput.value = '';
        ctx.drawImage(image, 0, 0);
        resetFlag();
        resetInfoMusic();
        resetSonform();
        saveSheet();
    }
}
startForm();

// canvasbtn
const canvasBox = document.querySelector('#canvasBox');
canvasBox.addEventListener('click', () => {
    saveSheet();
});

// Info Music
function drawInfoNum(value) {
    ctx.beginPath();
    ctx.fillStyle = '#EAEAEA';
    ctx.roundRect(56, 42, 112, 48, 8);
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.font = 'bold 24px Times';
    ctx.fillStyle = '#000000';
    ctx.fillText('Num : ' + value, 66, 73);
}

function drawInfoKey(value) {
    ctx.beginPath();
    ctx.fillStyle = '#EAEAEA';
    ctx.roundRect(168, 42, 124, 48);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px Times';
    ctx.fillStyle = '#000000';
    ctx.fillText('Key : ' + value, 235, 73);
}

function drawInfoTempo(value) {
    ctx.beginPath();
    ctx.fillStyle = '#EAEAEA';
    ctx.roundRect(298, 42, 152, 48, 8);
    ctx.fill();
    ctx.textAlign = 'right';
    ctx.font = 'bold 24px Times';
    ctx.fillStyle = '#000000';
    ctx.fillText('Tempo = ' + value, 440, 73);
}

function resetInfoMusic() {
    document.getElementById('info_num').value = 1;
    document.getElementById('info_key').value = 'C';
    document.getElementById('info_tempo').value = 110;
}

// Info Sheet
function drawInfoSheet(value) {
    ctx.fillStyle = 'white';
    ctx.fillRect(800,40,1134,73);
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'right';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(value, 1134, 73);
}

function inputInfoSheet() {
    let today = new Date();
    let info = prompt("악보 정보를 입력하세요.",today.toLocaleDateString());
    if (info != null) {
        drawInfoSheet(info);
    }

}

// Songform
list_Songform = []
function drawSongform(value) {
    list_Songform.push(value);
    ctx.fillStyle = 'white';
    ctx.fillRect(200, 120, 900, 40);
    ctx.textAlign = 'center';
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#e42e2e';
    ctx.fillText(list_Songform.join(" - "), 595, 155);
}

function resetSonform() {
    list_Songform.length = 0;
    ctx.fillStyle = 'white';
    ctx.fillRect(200, 120, 900, 40);
    ctx.textAlign = 'center';
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = 'lightgray';
    ctx.fillText("In - A - B - I - A - B - B - C - D - O", 595, 155);
}

// load Music Score
function loadImage(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = function () {
        clearImage();
        // set image size
        let imageHeight = (canvas.height - 166) * 96 / 100;
        let imageWidth = image.width * imageHeight / image.height;

        if (imageWidth > canvas.width * 96 / 100) {
            imageWidth = canvas.width * 96 / 100;
            imageHeight = image.height * imageWidth / image.width;
        }

        ctx.drawImage(image, (canvas.width - imageWidth) / 2, (166 + canvas.height - imageHeight) / 2, imageWidth, imageHeight);
        saveSheet();
    };
};

function clearImage() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 170, canvas.width, canvas.height)
}

imageInput.addEventListener('change', loadImage);


// Draw Flag
const canvasFlag = document.getElementById("canvasFlag");
const ctxFlag = canvasFlag.getContext('2d');
canvasFlag.width = 1190;
canvasFlag.height = 1684;
canvasFlag.backScreen = 'transparent';

let dragok = false;
let startX;
let startY;

canvasFlag.addEventListener('mousedown', myDown);
canvasFlag.addEventListener('mouseup', myUp);
canvasFlag.addEventListener('mousemove', myMove);

let flags = [];

function resetFlag() {
    clearCanvasFlag();
    flags.length = 0;
}

function clearCanvasFlag() {
    ctxFlag.clearRect(0, 0, canvasFlag.width, canvasFlag.height);
}

function createFlag(name) {
    flags.push({
        x: Math.floor(Math.random() * 951) + 120,
        y: Math.floor(Math.random() * 100) + 1500,
        width: 50,
        height: 50,
        strokeStyle: "red",
        fillStyle: "white",
        name: name,
        isDragging: false
    });
    draw();
    document.querySelector('#flag').value = 'flag';
}

function rect(r) {
    ctxFlag.save();
    ctxFlag.beginPath();
    // inner fill
    ctxFlag.fillStyle = r.fillStyle;
    ctxFlag.fillRect(r.x, r.y, r.width, r.height);
    // outline
    ctxFlag.lineWidth = 3;
    ctxFlag.strokeRect(r.x, r.y, r.width, r.height);
    // text
    ctxFlag.textAlign = 'center';
    ctxFlag.fillStyle = r.strokeStyle;
    ctxFlag.font = '37px Arial';
    ctxFlag.fillText(r.name, r.x + 25, r.y + 39);
    ctxFlag.restore();
}

function draw() {
    clearCanvasFlag();
    for (let i = 0; i < flags.length; i++) {
        rect(flags[i]);
    }
}

// handle mousedown events
function myDown(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    const mx = (e.offsetX / ((window.innerHeight * 595) / 969)) * canvasFlag.width;
    const my = (e.offsetY / ((window.innerHeight * 842) / 969)) * canvasFlag.height;

    // test each shape to see if mouse is inside
    dragok = false;
    for (let i = flags.length - 1; i >= 0; i--) {
        let s = flags[i];

        if (
            !dragok &&
            mx > s.x &&
            mx < s.x + s.width &&
            my > s.y &&
            my < s.y + s.height
          ) {
            // if yes, set that rects isDragging=true
            dragok = true;
            s.isDragging = true;
          }
    }
    // save the current mouse position
    startX = mx;
    startY = my;
}

// handle mouseup events
function myUp(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    dragok = false;
    for (let i = 0; i < flags.length; i++) {
        flags[i].isDragging = false;
    }
}

// handle mouse moves
function myMove(e) {
    // if we're dragging anything...
    if (dragok) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        const mx = (e.offsetX / ((window.innerHeight * 595) / 969)) * canvasFlag.width;
        const my = (e.offsetY / ((window.innerHeight * 842) / 969)) * canvasFlag.height;

        // calculate the distance the mouse has moved
        // since the last mousemove
        const dx = mx - startX;
        const dy = my - startY;

        // move each rect that isDragging
        // by the distance the mouse has moved
        // since the last mousemove
        for (let i = 0; i < flags.length; i++) {
            const s = flags[i];
            if (s.isDragging) {
                s.x += dx;
                s.y += dy;
            }
        }

        // redraw the scene with the new rect positions
        draw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;
    }
}

// Slidebox
const sheetSlide = [{
    id: 0,
    mainImage: '',
    submitImage: '../Sofo/Assets/defaultSheet.png',
    flagList: [],
    edit: true
}];
addSlideElement(0);

function controlSlide(id) {
    console.log(document.querySelector('#slidebox'), sheetSlide);
    saveSlide();

    if (String(id) == 'addSlide') {
        addNewSlide();
        showSlide();
        startForm();
    } else {
        bringOtherSlide(id);
        reloadSlide();
    }
}

function addNewSlide() {
    sheetSlide.push({
        id: sheetSlide.length,
        mainImage: '',
        submitImage: '../Sofo/Assets/defaultSheet.png',
        flagList: [],
        edit: true
    });
}

function showSlide() {
    // 기존의 slide를 제거
    for (let i = 1; i < sheetSlide.length; i++) {
        const slides = document.querySelector('.slide');
        slides.remove();
    }

    // sheetSlide에 있는 slide들을 표기
    for (let i = 0; i < sheetSlide.length; i++) {
        addSlideElement(i);
    }
}

function reloadSlide() {
    // 기존의 slide를 제거
    for (let i = 0; i < sheetSlide.length; i++) {
        const slides = document.querySelector('.slide');
        slides.remove();
    }

    // sheetSlide에 있는 slide들을 표기
    for (let i = 0; i < sheetSlide.length; i++) {
        addSlideElement(i);
    }
}

function addSlideElement(i) {
    const slide = new Image;
    slide.src = sheetSlide[i].submitImage;
    if (sheetSlide[i].edit) {
        slide.style = 'border: 2px solid #6C6C6C;';
    } else {
        slide.style = 'border: 2px solid #D2BDAB;';
    }
    slide.id = i;
    slide.className = 'slide';
    slide.setAttribute('onclick', 'controlSlide(id)');
    document.querySelector('#slidebox').appendChild(slide);
}

function saveSlide() {
    for (let i = 0; i < sheetSlide.length; i++) {
        if (sheetSlide[i].edit) {
            console.log(i);
            combineCanvas();
            const s = sheetSlide[i];
            s.mainImage = canvas.toDataURL();
            s.submitImage = canvasSubmit.toDataURL();
            s.flagList = Array.from(flags);
            s.edit = false;
        }
    }
}

function saveSheet() {
    for (let i = 0; i < sheetSlide.length; i++) {
        if (sheetSlide[i].edit) {
            console.log(i);
            combineCanvas();
            const s = sheetSlide[i];
            s.mainImage = canvas.toDataURL();
            s.submitImage = canvasSubmit.toDataURL();
            s.flagList = Array.from(flags);
        }
    }
    reloadSlide();
}

function bringOtherSlide(i) {
    const s = sheetSlide[i];
    s.edit = true;
    const image = new Image();
    image.src = s.mainImage;
    image.onload = function () {
        resetFlag();
        resetInfoMusic();
        resetSonform();
        ctx.drawImage(image, 0, 0);
        flags = Array.from(s.flagList);
        draw();
    }
}


// AREA --- canvasSubmit ---
const canvasSubmit = document.getElementById('canvasSubmit');
ctxSubmit = canvasSubmit.getContext('2d')
canvasSubmit.width = 1190;
canvasSubmit.height = 1684;

// Combine Canvas
function combineCanvas() {
    ctxSubmit.drawImage(canvas, 0, 0);
    ctxSubmit.drawImage(canvasFlag, 0, 0);
}

// modal page
function btn_view() {
    combineCanvas();
    const modal = document.querySelector('#modal');

    const url = canvasSubmit.toDataURL();
    const Fullscreen = document.querySelector("#canvasFullscreen");
    Fullscreen.src = url;

    modal.style.display = 'block';
}

function backScreen() {
    const modal = document.querySelector('#modal');

    modal.style.display = 'none';
}

function closeInform() {
    const inform = document.querySelector('#inform_modal');
    inform.style.display = 'none';
}

// download
function btn_save() {
    combineCanvas();
    const url = canvasSubmit.toDataURL();
    const Fullscreen = document.querySelector("#canvasFullscreen");
    Fullscreen.src = url;
    const a = document.createElement("a");
    a.href = url;
    a.download = "Sofo_Score.png";
    a.click();
    document.body.removeChild(a);
}


// btn Box url
function btn_home() {
    window.open('https://intro.sofomusic.com/');
}

function btn_sample() {
    window.open('https://intro.sofomusic.com/sample');
}

function btn_feedback() {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSegiRFCoM7ZomJR2cIKwV1h_4cxyggZgjNm6Y59r9K8qtfl5A/viewform?usp=sf_link');
}

function btn_tutorial() {
    window.open('https://intro.sofomusic.com/guide');
}
