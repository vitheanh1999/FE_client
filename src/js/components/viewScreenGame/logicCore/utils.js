export const removeTimeout = (timeout) => {
  if (timeout) {
    clearTimeout(timeout);
  }
  return null;
};

export const removeTimeInterval = (timeInterval) => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  return null;
};
