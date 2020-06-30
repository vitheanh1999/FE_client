import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MenuPopup from './gameMenu/MenuPopup';

const isMobile = false;

const ActionWrapper = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  margin-left: auto;
  margin-right: auto;
  z-index: 11;
`;

const Label = styled.div`
  font-weight: 600;
  font-family: Arial, sans-serif;
  font-size: ${props => props.scale * 16}px;
  color: #7eb566;
  margin-left: 10px;
  margin-right: 10px;
`;

const Line = styled.div`
  width: 1px;
  height: ${props => props.scale * 31}px;
  opacity: 0.3;
  background: #fff;
  margin-right: ${props => props.scale * 6}px;
`;

const WrapperView = styled.div`
  display: flex;
  height: ${props => props.scale * 31}px;
  align-items: center;
  background: rgba(8, 9, 9, 0.5);
  border: 1px;
  border-bottom-left-radius: ${props => props.scale * 8}px;
  flex-direction: row;
`;

const MENU = {
  NONE: 0,
  LIST_TABLE: 2,
  HISTORY: 6,
  SETTING: 3,
  SOUND: 4,
  HELP: 5,
};

class GameMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.bgAudio = null;
    this.audioPlayerRef = React.createRef();
  }

  componentDidMount() {
  }

  onclickSelectTable(tableData) {
    const { choseTable, tableId } = this.props;
    if (tableData.id !== tableId) {
      this.setState({ menuStatus: MENU.NONE }, () => {
        choseTable(tableData);
      });
    } else {
      this.setState({ menuStatus: MENU.NONE });
    }
  }

  getListTable() {
  }

  getAllLobbyBoardData() {
  }

  resetDataOfTable(tableName) {
  }

  renderTableView(menuStatus) {
    const { allTableData, nameTable } = this.props;
    if (menuStatus === MENU.LIST_TABLE) {
      const { soundStatus } = this.state;
      let distance = '';
      if (soundStatus) {
        distance = isMobile ? '23px' : '148px';
      } else {
        distance = isMobile ? '42px' : '161px';
      }
      return (
        <MenuPopup
          title="tableSelect"
          allTableData={allTableData}
          trianglePosition={distance}
          closePopup={() => this.setState({ menuStatus: MENU.NONE })}
          onClick={(tableData) => {
            this.onclickSelectTable(tableData);
          }}
          type="select_table"
          resetTable={(tableName) => {
            this.resetDataOfTable(tableName);
          }}
          nameTable={nameTable}
        />
      );
    }
    return null;
  }

  renderHelpView(menuStatus) {
    if (menuStatus === MENU.HELP) {
      return (
        <MenuPopup
          title="help"
          trianglePosition="263px"
          closePopup={() => this.setState({ menuStatus: MENU.NONE })}
          type="help"
          content=""
        />
      );
    }
    return null;
  }

  renderSettingView(menuStatus) {
    const { nameTable } = this.props;
    if (menuStatus === MENU.SETTING) {
      const { soundStatus } = this.state;
      const distance = soundStatus ? '195px' : '206px';
      return (
        <MenuPopup
          title="setting"
          trianglePosition={distance}
          closePopup={() => this.setState({ menuStatus: MENU.NONE })}
          type="setting"
          nameTable={nameTable}
        />
      );
    }
    return null;
  }

  render() {
    const {
      nameTable, scale,
    } = this.props;

    return (
      <ActionWrapper scale={scale}>
        {
          <WrapperView id="game_menu" isMobile={isMobile} scale={scale}>
            <Label scale={scale}>{`${nameTable}`}</Label>
          </WrapperView>
        }
      </ActionWrapper>
    );
  }
}

GameMenu.propTypes = {
  nameTable: PropTypes.string.isRequired,
  choseTable: PropTypes.func.isRequired,
  allTableData: PropTypes.objectOf(PropTypes.any),
  tableId: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
};

GameMenu.defaultProps = {
  allTableData: null,
};
export default GameMenu;
