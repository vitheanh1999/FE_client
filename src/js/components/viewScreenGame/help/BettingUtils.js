
export const rotateBoundingRect = (rect) => {
  if (window.isRotate() === false) return rect;
  const rotate = { top: 0 };
  rotate.top = document.body.clientWidth - rect.right;
  rotate.bottom = document.body.clientWidth - rect.left;
  rotate.height = rect.width;
  rotate.left = rect.top;
  rotate.right = rect.top + rect.height;
  rotate.width = rect.height;
  rotate.x = rect.top;
  rotate.y = document.body.clientWidth - rect.right;
  return rotate;
};

export const foo = 1;
