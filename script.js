const h2Element = document.getElementById('h2');
const decreaseButton = document.getElementById('decrease');
const increaseButton = document.getElementById('increase');
let value = parseInt(h2Element.textContent, 10);
const button = document.getElementById('start');
const chance = document.getElementById('chance');
let loadingInProgress = false;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep(ms) {
    await delay(ms);
}

decreaseButton.addEventListener('click', () => {
    if (value > 3) {
        value -= 2;
        h2Element.textContent = value;
    }
});

increaseButton.addEventListener('click', () => {
    if (value < 7) {
        value += 2;
        h2Element.textContent = value;
    }
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

window.onload = function() {
    // Get the canvas element and its context
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    let path = Array(25).fill(0);

    // Create new Image objects
    const cube = new Image();
    const cross = new Image();
    const star = new Image();

    // Set the source paths for the images
    cube.src = 'cube.jpg';
    cross.src = 'cross.jpg';
    star.src = 'star.jpg';
    // Function to create a single-colored background using RGB
    function fillBackground(r, g, b) {
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    function showPath(size) {
        for (let i = 0; i < 25; i++) {
            if (path[i]) {
                drawPicture(Math.floor(i /5), i % 5, star, size);
            }
            else {
                drawPicture(Math.floor(i /5), i % 5, cube, size);
            }
        }
    }
    async function drawRoundedRect(x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.arc(x + width - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * Math.PI);
            ctx.lineTo(x + radius, y + height);
            ctx.arc(x + radius, y + height - radius, radius, 0.5 * Math.PI, Math.PI);
            ctx.lineTo(x, y + radius);
            ctx.arc(x + radius, y + radius, radius, Math.PI, 1.5 * Math.PI);
            ctx.closePath();
            ctx.fill();
    }
    // Function to draw a picture at a specified line and row
    function drawPicture(line, row, picture, size) {
        const spaces = 30;
        const xPos = spaces + (150 + spaces) * line;
        const yPos = spaces + (150 + spaces) * row;
        const add = (150 - size) / 2;
        ctx.drawImage(picture, xPos + add, yPos + add, size, size);
    }
    function fillImage(image) {
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                drawPicture(x, y, image, 150);
            }
        }
    }
    async function hide() {
        const ticks = 15;
        for (let i = ticks; i >= 0; i--) {
            fillBackground(9, 15, 29);
            showPath(10 * i);
            await sleep(20);
        }
    }
    async function show() {
        const ticks = 15;
        for (let i = 0; i <= ticks; i++) {
            fillBackground(9, 15, 29);
            showPath(10 * i);
            await sleep(20);
        }
    }

    async function load(r, g, b, f, a) {
        let w = 400;
        let h = f * 5;
        let p = 0;

        while (p != 100) {
            p += getRandomInt(5, 25);
            await sleep(getRandomInt(100, 300));
            if (p > 100) p = 100;
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            await drawRoundedRect((canvas.width - w) / 2, (canvas.height - h) / 2, w * p / 100, h, a);
        }
    }

    async function showSignal() {
        if (loadingInProgress == false) {
            loadingInProgress = true;
            button.textContent = 'Ожидайте';
            await hide();
            await sleep(300);
            await load(91, 129, 152, 3, 5);
            await sleep(100);
            await load(9, 15, 29, 5, 0);
            setData();
            await sleep(300);
            await show();
            button.textContent = 'Получить сигнал';
            chance.textContent = getRandomInt(810, 999) / 10 + '%';
            loadingInProgress = false;
        }
    }

    function setData() {
        path = Array(25).fill(0);
        let num = getRandomInt(4, 6)
        while (true) {

            path[getRandomInt(0, 24)] = 1;
            let sum = 0;
            for (const el of path) {
                sum += el;
            }
            if (sum == num) {
                break;
            }
        }


    }

    // Function to load an image and return a Promise
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
            img.src = src;
        });
    }

    // Load all images and then run the function
    Promise.all([
        loadImage('cube.jpg'),
        loadImage('cross.jpg'),
        loadImage('star.jpg')
    ])
    .then(([cube, cross, star]) => {

        // Fill the canvas with a color
        fillBackground(9, 15, 29); // Example RGB color

        button.addEventListener('click', showSignal);
        // Draw images once all are loaded
        fillImage(cube);

    })
    .catch(error => {
        console.error(error.message);
    });
};
