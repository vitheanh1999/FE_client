import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import { isMobile } from 'react-device-detect';
import images from '../../../../assets/lucImage';
import TableList from './TableList';
import GameHelp from './GameHelp';

const Main = styled.div`
  display: flex;
  right: 11px;
  width: 332px;
  height: auto;
  position: absolute;
  margin-top: ${isMobile ? '56px' : '35px'};
  margin-right: -11px;
`;
const BgTable = styled.div`
  width: ${props => props.width};
  background-color: rgba(8, 9, 9, 0.8);
  padding: 3px 10px 3px 15px;
  margin-right: 0;
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
`;
const Close = styled.img`
  width: 13px;
  height: 13px;
  right: 24px;
  cursor: pointer;
  top: -2px;
  margin-left: auto;
`;
const Title = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 700;
  margin-top: 5px;
`;

const Triangle = styled.div`
  width: 0;
  height: 0;
  margin-top: -13px;
  margin-left: ${props => props.trianglePosition};
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid rgba(8, 9, 9, 0.8);
  position: absolute;
`;

const Content = styled.div`
  margin-top: 7px;
  text-align: left;
  height: auto;
  font-size: 14px;
`;

class MenuPopup extends Component {
  componentDidMount() { }

  ClickItem(tableData) {
    const { onClick } = this.props;
    if (onClick !== undefined) { onClick(tableData); }
  }

  render() {
    const {
      title, trianglePosition, closePopup, type, allTableData, resetTable, nameTable,
    } = this.props;
    let popupContent = '';
    const widthBgTable = '315px';
    switch (type) {
      case 'help':
        popupContent = <GameHelp />;
        break;
      case 'select_table':
        popupContent = (
          <TableList
            allTableData={allTableData}
            itemClick={tableData => this.ClickItem(tableData)}
            resetTable={resetTable}
            currentTable={nameTable}
          />
        );
        break;
      default:
        break;
    }
    return (
      <OutsideClickHandler
        onOutsideClick={() => closePopup()}
      >
        <Main>
          <BgTable width={widthBgTable}>
            <Triangle trianglePosition={trianglePosition} />
            <Header>
              <Title>{title}</Title>
              <Close
                src={images.iconX}
                onClick={() => {
                  closePopup();
                }}
              />
            </Header>
            <Content>
              {popupContent}
            </Content>
          </BgTable>
        </Main>
      </OutsideClickHandler>
    );
  }
}

MenuPopup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  nameTable: PropTypes.string,
  trianglePosition: PropTypes.string.isRequired,
  allTableData: PropTypes.oneOfType([PropTypes.object]),
  resetTable: PropTypes.func,
};

MenuPopup.defaultProps = {
  onClick: null,
  nameTable: '',
  allTableData: null,
  resetTable: null,
};

export default MenuPopup;
