export const getCursorPos = (input) => {
  try {
    return {
      start: input.selectionStart,
      end: input.selectionEnd,
    };
  } catch (e) {
    return {
      start: 0,
      end: 0,
    };
  }
};

export const setCursorPos = (input, start, end = null) => {
  const endIndex = end || start;
  input.selectionStart = start;
  input.selectionEnd = endIndex;
};
