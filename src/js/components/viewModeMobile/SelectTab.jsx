import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 2.5em;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const Button = styled.div`
  width: 45%;
  height: 1.8em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: white;
  border-radius: 0.2em;
  background-color: ${props => (props.enable ? '#2d889c' : '#333')};
`;

export const TAB_VIEW_MODE = {
  HISTORY: 1,
  LOBBY: 2,
};

class SelectTab extends PureComponent {
  render() {
    const { selectedTab, changeTab } = this.props;
    return (
      <Wrapper>
        <Button
          enable={selectedTab === TAB_VIEW_MODE.HISTORY}
          onClick={() => changeTab(TAB_VIEW_MODE.HISTORY)}
        >出目表
        </Button>
        <Button
          enable={selectedTab === TAB_VIEW_MODE.LOBBY}
          onClick={() => changeTab(TAB_VIEW_MODE.LOBBY)}
        >履歴
        </Button>
      </Wrapper>
    );
  }
}

SelectTab.propTypes = {
  selectedTab: PropTypes.number.isRequired,
  changeTab: PropTypes.func.isRequired,
};

SelectTab.defaultProps = {
};
export default SelectTab;
