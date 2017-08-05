const backCanvas = document.querySelector('#canvas');
const backCtx = backCanvas.getContext('2d');
const mainCanvas = document.createElement('canvas');
const mainCtx = mainCanvas.getContext('2d');

const configCanvas = (cnvs, w, h) => {
  cnvs.width = w; // eslint-disable-line
  cnvs.height = h; // eslint-disable-line
};

const width = document.body.clientWidth;
const height = document.body.clientHeight;

configCanvas(backCanvas, width, height);
configCanvas(mainCanvas, width, height);

const image2 = new Image();
image2.src = './img/2.jpg';

const image1 = new Image();
image1.src = './img/1.jpg';

const image3 = new Image();
image3.src = './img/3.jpg';

const rowsCount = 50;
const colsCount = 100;


const randTrueFalse = () => (Math.random() > 0.5);

const grid = [];
const shufleGrid = () => {
  for (let i = 0; i < rowsCount; i += 1) {
    grid[i] = grid[i] ? grid[i] : [];
    for (let j = 0; j < colsCount; j += 1) {
      grid[i][j] = randTrueFalse();
    }
  }
};


const dx = width / colsCount;
const dy = height / rowsCount;

const startK = 0;
let k = startK;
let into = false;

document.addEventListener('click', () => {
  into = !into;
});

const fromRange = (a, b, val) => {
  if (val > b) return b;
  if (val < a) return a;
  return val;
};

shufleGrid();
const currentImage = image1;
const nextImage = image2;
const updateMainCanvas = () => {
  if (k < 2 && into === true) {
    k = fromRange(startK, 2, k + 0.04);
  } else if (k > startK && into === false) {
    k = fromRange(startK, 2, k - 0.04);
  } else if (into === false) {
    shufleGrid();
  }
  mainCtx.clearRect(0, 0, width, height);
  mainCtx.drawImage(currentImage, 0, 0, width, height);
  for (let i = 0; i < rowsCount; i += 1) {
    for (let j = 0; j < colsCount; j += 1) {
      let delay = k - ((j) / (colsCount));
      delay = fromRange(0, 1, delay);
      mainCtx.clearRect(j * dx, i * dy, dx * delay, dy * delay);
    }
  }
};

const render = (t) => {
  updateMainCanvas(t);
  backCtx.drawImage(image2, 0, 0, width, height);
  backCtx.drawImage(mainCanvas, 0, 0, width, height);
  requestAnimationFrame(render);
};

render();
