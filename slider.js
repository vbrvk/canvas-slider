const fromRange = (a, b, val) => {
  if (val > b) return b;
  if (val < a) return a;
  return val;
};

class Slider {
  constructor(settings) {
    this.node = settings.node;
    this.width = settings.width || 600;
    this.height = settings.height || 300;
    this.rows = settings.rows || 50;
    this.cols = settings.cols || 100;
    this.images = settings.images.map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    });
    this.time = settings.time || 1;

    this.dx = this.width / this.cols;
    this.dy = this.height / this.rows;

    this.tl = new TimelineMax();
    this.k = {
      pos: 0,
      start: 0,
      end: 2
    };

    this.currentImageIndex = 0;
    this.nextImageIndex = 1;
    this.previousSide = 'right';


    this.backCanvas = document.createElement('canvas');
    this.backCtx = this.backCanvas.getContext('2d');
    this.node.appendChild(this.backCanvas);

    this.mainCanvas = document.createElement('canvas');
    this.mainCtx = this.mainCanvas.getContext('2d');
    this.canvasSetup(this.backCanvas);
    this.canvasSetup(this.mainCanvas);

    this.node.addEventListener('click', (e) => {
      const side = e.clientX < this.width / 2 ? 'left' : 'right';
      const changeImage = side === 'left' ? this.backwardImage : this.forwardImage;
      // it fix needs of double click for changing direction
      if (side !== this.previousSide) changeImage(0);
      changeImage(this.time);
      this.previousSide = side;
    });

    this.render = this.render.bind(this);
    this.forwardImage = this.forwardImage.bind(this);
    this.backwardImage = this.backwardImage.bind(this);
  }

  canvasSetup(canvas) {
    canvas.width = this.width; // eslint-disable-line
    canvas.height = this.height; // eslint-disable-line
  }

  forwardImage(time) {
    this.tl.to(this.k, time, {
      pos: this.k.end,
      onComplete: () => {
        this.currentImageIndex = this.nextImageIndex;
        this.nextImageIndex += 1;
        if (this.nextImageIndex === this.images.length) this.nextImageIndex = 0;
        this.k.pos = this.k.start;
      }
    });
  }

  backwardImage(time) {
    this.tl.to(this.k, time * 1.4, { // Without factor this animation is faster
      pos: this.k.start,
      onComplete: () => {
        this.nextImageIndex = this.currentImageIndex;
        this.currentImageIndex -= 1;
        if (this.currentImageIndex === -1) this.currentImageIndex = this.images.length - 1;
        this.k.pos = this.k.end;
      }
    });
  }

  updateMainCanvas() {
    this.mainCtx.drawImage(this.images[this.currentImageIndex], 0, 0, this.width, this.height);
    for (let i = 0; i < this.rows; i += 1) {
      for (let j = 0; j < this.cols; j += 1) {
        let delay = this.k.pos - ((j) / (this.cols));
        delay = fromRange(0, 1, delay);
        this.mainCtx.clearRect(j * this.dx, i * this.dy, this.dx * delay, this.dy * delay);
      }
    }
  }

  render() {
    this.updateMainCanvas();
    this.backCtx.drawImage(this.images[this.nextImageIndex], 0, 0, this.width, this.height);
    this.backCtx.drawImage(this.mainCanvas, 0, 0, this.width, this.height);
    requestAnimationFrame(this.render);
  }
}
