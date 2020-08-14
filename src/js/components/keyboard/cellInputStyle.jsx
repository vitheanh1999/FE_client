import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: ${props => props.width};
  height: ${props => props.height};
  background-color: ${props => props.backgroundColor};
  ${props => (!props.canEdit ? 'background-color: #61636175' : '')};
  ${props => props.flex && 'flex: 1;'}
  font-size: ${props => props.fontSize};
  border-width: 1px;
  border-right-width: 0;
  border-color: ${props => (props.isFocus ? 'red' : 'gray')};
  border-style: solid;
  box-sizing: border-box;
  position: relative;
  ${props => (props.lastColum || props.isFocus) && `border-right-width: ${props.borderWidth};`};
`;

export const Color = {
  highlightBackground: '#f00',
  highlightBorder: '#ff0',
};

export const InputNumber = styled.input`
  width: 100%;
  height: 100%;
  padding-right: ${props => (props.invalid ? 1.3 : 0.5)}em;
  border-style: none;
  border-width: 0;
  border-color: #fff0;
  background-color: transparent;
  text-align: right;
  -moz-appearance: textfield;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  :focus {
    outline: none;
    text-align: left;
  }
`;

export const ContentText = styled.div`
  user-select: none;
  color: ${props => (props.isShowPlaceholder ? 'gray' : 'unset')};
  font-size: ${props => (props.isShowPlaceholder ? '0.9' : '1')}em;
`;

export const getWidthHeight = (value) => {
  if (typeof (value) === 'string') return value;
  if (value < 0) return 'unset';
  return `${value}em`;
};

export const getRadius = (fontSize) => {
  if (typeof (fontSize) === 'string') return '0.1em';
  if (fontSize < 0) return 'unset';
  return `${fontSize * 0.2}em`;
};

export const getBorderWidth = (fontSize) => {
  if (typeof (fontSize) === 'string') return '0.05em';
  if (fontSize < 0) return 'unset';
  return `${fontSize * 0.05}em`;
};

export const ContentWrapper = styled.div`
  width: ${props => (props.invalid ? '90%' : '100%')};
  height: 100%;
  display: flex;
  justify-content: ${props => (props.isFocus ? 'flex-start' : 'flex-end')};
  align-items: center;
  ${props => (props.isFocus ? 'padding-left: 0.5em;' : 'padding-right: 0.5em;')};
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Icon = styled.img`
  position: absolute;
  right: 0.1em;
  width: 1em;
`;

export const DisablePanel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #61636175;
`;
