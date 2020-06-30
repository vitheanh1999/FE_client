// import { isMobile } from 'react-device-detect';
const isMobile = false;

// scale && rotate this content
const handleResize = (clientWidth, clientHeight) => {
  let scale;
  const root = document.getElementById('app');
  if (clientWidth > clientHeight * 1920 / 969) {
    scale = clientHeight / 969;
  } else {
    scale = clientWidth / 1920;
  }
  root.setAttribute('style', `font-size: ${20 * scale}px`);
};

window.getScale = () => {
  let { clientWidth, clientHeight } = document.body;
  let scale = 1;
  if (isMobile === true) {
    if (clientWidth < clientHeight) {
      const temp = clientWidth;
      clientWidth = clientHeight;
      clientHeight = temp;
    }
  }

  if (clientWidth > clientHeight * 1920 / 969) {
    scale = clientHeight / 969;
  } else {
    scale = clientWidth / 1920;
  }
  return scale;
};

// detect if PC
const resizePC = () => {
  const { clientWidth, clientHeight } = document.body;
  handleResize(clientWidth, clientHeight);
};

// detect if SP
const resizeSP = () => {
  let { clientWidth, clientHeight } = document.body;
  if (clientWidth < clientHeight) {
    const temp = clientWidth;
    clientWidth = clientHeight;
    clientHeight = temp;
  }
  handleResize(clientWidth, clientHeight);
};

window.isRotate = () => {
  if (isMobile === true) {
    const { clientWidth, clientHeight } = document.body;
    return (clientWidth < clientHeight);
  }
  return false;
};

const onResize = () => (
  isMobile ? resizeSP() : resizePC()
);

export const onDisableZoom = () => {
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, true);
  let lastTouch = 0;
  document.addEventListener('touchend', (event) => {
    const now = window.performance.now();
    if (now - lastTouch <= 500) {
      event.preventDefault();
    }
    lastTouch = now;
  }, true);
};


const Resize = () => {
  document.getElementById('app').click();
  window.addEventListener('resize', onResize);
  document.body.setAttribute('style', 'overflow: hidden');
  onResize();
};

export const RemoveAutoResize = () => {
  window.removeEventListener('resize', onResize);
};

export default Resize;
