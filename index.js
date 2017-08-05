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

const images = [
  './img/1.jpg',
  './img/2.jpg',
  './img/3.jpg'
].map((src) => {
  const image = new Image();
  image.src = src;
  return image;
});

const list = [
  {
    id: 0,
    value: images[0],
    next: 1,
    prev: 2
  },
  {
    id: 1,
    value: images[1],
    next: 2,
    prev: 0
  },
  {
    id: 2,
    value: images[2],
    next: 0,
    prev: 1
  },
]

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

const tl = new TimelineMax();

const k = {
  pos: 0
};

document.addEventListener('click', (e) => {
  const side = e.clientX < width / 2 ? 'left' : 'right';
  if (side === 'right') forwardImage();
  if (side === 'left') backwardImage();
});

const fromRange = (a, b, val) => {
  if (val > b) return b;
  if (val < a) return a;
  return val;
};

shufleGrid();
let prevImage = list[2];
let currentImage = list[0];
let nextImage = list[1];

let currentImageIndex = 0;
let nextImageIndex = 1;

const forwardImage = () => {
  tl.to(k, 1, {
    pos: 2,
    onComplete: () => {
      currentImageIndex = nextImageIndex;
      nextImageIndex = nextImageIndex + 1;
      if (nextImageIndex === images.length) nextImageIndex = 0;
      k.pos = 0;
    }
  });
};

const backwardImage = () => {
  tl.to(k, 1, {
    pos: 0,
    onComplete: () => {
      nextImageIndex = currentImageIndex;
      currentImageIndex = currentImageIndex - 1;
      if (currentImageIndex === -1) currentImageIndex = images.length - 1;
      k.pos = 2;
    }
  });
};

const updateMainCanvas = () => {
  mainCtx.clearRect(0, 0, width, height);
  mainCtx.drawImage(images[currentImageIndex], 0, 0, width, height);
  for (let i = 0; i < rowsCount; i += 1) {
    for (let j = 0; j < colsCount; j += 1) {
      let delay = k.pos - ((j) / (colsCount));
      delay = fromRange(0, 1, delay);
      mainCtx.clearRect(j * dx, i * dy, dx * delay, dy * delay);
    }
  }
};

const render = (t) => {
  updateMainCanvas(t);
  backCtx.drawImage(images[nextImageIndex], 0, 0, width, height);
  backCtx.drawImage(mainCanvas, 0, 0, width, height);
  requestAnimationFrame(render);
};

render();
