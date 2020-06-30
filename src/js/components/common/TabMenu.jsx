import React, { Component } from 'react';
// import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const RedDot = styled.div`
  margin-left: 10px;
  background-color: red;
  border-radius: 50%;
  width: 1.125em;
  height: 1.125em;
  color: #fff;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 46px;
  margin-top: 15px;
  margin-right: 40px;
  display: flex;
  flex-direction: row;
`;

const DivLeft = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  justify-content: flex-start;
`;

const TabButton = styled.div`
  width: ${props => (props.isSelected ? 100 : 90)}%;
  height: ${props => (props.isSelected ? 100 : 85)}%;
  background-color: ${props => (props.isSelected ? '#333' : '#2d889c')};
  border-radius: ${props => (props.isSelected ? '9px 9px 0 0' : '9px')};
  font-size: 1em;
  text-transform: uppercase;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1px;
  font-weight: 600;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: ${props => (props.isSelected ? '#555252' : '#00647a')};
  }
`;

const DivRight = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
`;

export default class TabMenu extends Component {
  componentDidMount() {
  }

  leftTabOnClick() {
    const { onChange, isSelectLeft } = this.props;
    if (isSelectLeft === false && onChange) onChange();
  }

  rightTabOnClick() {
    const { onChange, isSelectLeft } = this.props;
    if (isSelectLeft === true && onChange) onChange();
  }

  render() {
    const {
      textLeft,
      isSelectLeft,
      textRight,
      notificationNumber,
    } = this.props;

    const scale = window.innerWidth / 1920;

    return (
      <Wrapper>
        <DivLeft>
          <TabButton
            isSelected={isSelectLeft}
            onClick={() => this.leftTabOnClick()}
            scale={scale}
          >
            {textLeft}
          </TabButton>
        </DivLeft>
        <DivRight>
          <TabButton
            isSelected={!isSelectLeft}
            onClick={() => this.rightTabOnClick()}
            scale={scale}
          >
            {textRight}
            {
              notificationNumber !== 0 && (
                <RedDot>
                  {notificationNumber}
                </RedDot>
              )}
          </TabButton>
        </DivRight>
      </Wrapper>
    );
  }
}

TabMenu.defaultProps = {
  onChange: null,
  notificationNumber: 0,
};

TabMenu.propTypes = {
  textLeft: PropTypes.string.isRequired,
  textRight: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  isSelectLeft: PropTypes.bool.isRequired,
  notificationNumber: PropTypes.number,
};
