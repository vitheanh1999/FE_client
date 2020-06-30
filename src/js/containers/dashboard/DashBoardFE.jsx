import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';
import MobileMenu from '../../components/menu/MobileMenu';
import { TAB } from '../../constants/Constants';
import {
  Container, Header, WrapperContent, Body, IconMenu, calculatorFontSize,
} from './DashBoardFEStyle';
import images from '../../theme/images';
import ListBots from '../listBots/ListBots';

export const Check = () => {
  if (isMobile) {
    if (window.orientation === 90) return false;
    return true;
  } return false;
};


const isRotation = Check();


class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: TAB.DASHBOARD,
      isOpenMenuTab: true,
    };
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.closeMenuTab = this.closeMenuTab.bind(this);
    this.openMenuTab = this.openMenuTab.bind(this);
  }

  handleChangeTab(newTab) {
    const { activeTab } = this.state;
    if (newTab.value !== activeTab.value) {
      this.setState({
        activeTab: newTab,
      });
    }
    if (isRotation) this.closeMenuTab();
  }

  closeMenuTab() {
    this.setState({
      isOpenMenuTab: false,
    });
  }

  openMenuTab() {
    this.setState({
      isOpenMenuTab: true,
    });
  }

  renderMainContent() {
    const { activeTab } = this.state;
    let tab;
    switch (activeTab.value) {
      case TAB.DASHBOARD.value:
        tab = (<div>dashboard</div>);
        break;
      case TAB.REVENUE.value:
        tab = (<div>Revenue</div>);
        break;
      case TAB.BOT.value:
        tab = (
          <ListBots
            handleChangeTab={this.handleChangeTab}
          />
        );
        break;
      case TAB.CHARGE.value:
        tab = (<div>Charge</div>);
        break;
      default: break;
    }
    return (
      <Body>
        {tab}
      </Body>
    );
  }

  render() {
    const { activeTab, isOpenMenuTab } = this.state;
    const fontSize = isRotation ? calculatorFontSize() * 1.5 : calculatorFontSize();
    return (
      <Container>
        {isOpenMenuTab && (
        <MobileMenu
          isRotation={isRotation}
          isMobile={isMobile}
          handleChangeTab={this.handleChangeTab}
          activeTab={activeTab}
          closeMenuTab={this.closeMenuTab}
          fontSize={fontSize}
        />
        )}
        <WrapperContent isRotation={isRotation}>
          <Header onClick={() => this.handleChangeTab()} fontSize={fontSize}>
            {activeTab.name}
            { isRotation && <IconMenu src={images.menuIcon} alt="menu icon" onClick={() => this.openMenuTab()} /> }
          </Header>
          {this.renderMainContent()}
        </WrapperContent>
      </Container>
    );
  }
}

export default DashBoard;
