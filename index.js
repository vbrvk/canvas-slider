const width = document.body.clientWidth;
const height = document.body.clientHeight;
const node = document.querySelector('.node');

const slider = new Slider({
  node,
  width,
  height,
  time: 1,
  images: [
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg'
  ]
});

slider.render();
