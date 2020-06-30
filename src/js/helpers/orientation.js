const isMobile = false;
export const ORIENT = {
  HORIZONTAL: 1,
  PORTRAIT: 2,
};

export const getOrientation = () => {
  if (isMobile === false) return ORIENT.HORIZONTAL;
  if (window.orientation === 90 || window.orientation === -90) {
    return ORIENT.HORIZONTAL;
  }
  return ORIENT.PORTRAIT;
};
