import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
// import Images from '../../../assets/images';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: ${props => props.flex || 'unset'};
  width: ${props => props.width};
  border-width: 1px 0 0 1px;
  border-right-width: ${props => (props.lastColumn ? 1 : 0)}px;
  border-color: black;
  border-style: solid;
  font-weight: 600;
  box-sizing: border-box;
  font-size: 2em;
  user-select: none;
  background-color: ${props => props.backgroundColor || '#8b94a0'};
  color: ${props => props.color || '#fff'};

  &:active {
    background-color: #4bccb5;
  }
`;

class Key extends PureComponent {
  render() {
    const {
      onClick, children, flex, width, onTouchEnd, lastColumn, backgroundColor, color,
    } = this.props;
    const doNothing = () => {};
    return (
      <Wrapper
        onClick={isMobile ? doNothing : onClick}
        onTouchStart={isMobile ? onClick : doNothing}
        onTouchEnd={isMobile ? onTouchEnd : doNothing}
        flex={flex}
        width={width}
        lastColumn={lastColumn}
        backgroundColor={backgroundColor}
        color={color}
        tabIndex={-1}
      >
        { children }
      </Wrapper>
    );
  }
}

Key.defaultProps = {
  onClick: () => {},
  onTouchEnd: () => {},
  children: '',
  flex: 1,
  width: 'unset',
  lastColumn: false,
  backgroundColor: '',
  color: '',
};

Key.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.any,
  flex: PropTypes.number,
  width: PropTypes.any,
  onTouchEnd: PropTypes.func, // event when touch end
  lastColumn: PropTypes.bool,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
};

export default Key;
