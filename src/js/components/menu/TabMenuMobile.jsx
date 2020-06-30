import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropsType from 'prop-types';
import StorageUtils from '../../helpers/StorageUtils';
import { TAB } from '../../constants/Constants';
import { imagesMobile } from '../../theme';
import i18n from '../../i18n/i18n';

const Container = styled.div`
  background-color: #2d889c;
  position: absolute;
  z-index: 1;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: scroll;
`;
const TabMenuHeader = styled.div`
  background-color: #eee;
  width: 100%;
  padding: 1em 1em 1em 0.25em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LogoCompany = styled.img`
  margin-bottom: 1em;
`;
const ButtonClose = styled.img`
  height: 1em;
  display: flex;
  align-self: flex-end;
`;
const TabMenuBody = styled.ul`
  width: 100%;
  padding-left: 0;
  padding-right: 0;
  display: flex;
  flex-direction: column;
`;
const TabMenuItem = styled.div`
  height: 4em;
  display: flex;
  align-items: center;
  color: #fff;
  padding-left: 10%;

  &: active {
    background-color: #00647a;
    border-left: 0.5em solid #5fa6b5;
  }
`;

const Line = styled.div`
  border-bottom: 1px ridge #5fa6b5;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

class TabMenuMobile extends PureComponent {
  render() {
    const {
      userInfo, handleChangeTab, closeMenu, logout,
    } = this.props;
    return (
      <Container>
        <TabMenuHeader>
          <ButtonClose
            src={imagesMobile.iconXBlue}
            onClick={closeMenu}
          />
          <LogoCompany src={StorageUtils.getCompanyInfo().miniLogo} width="30%" onClick={() => handleChangeTab(TAB.DASHBOARD)} />
          <div>{i18n.t('userId')} : {userInfo.id}</div>
        </TabMenuHeader>
        <TabMenuBody>
          <TabMenuItem onClick={() => handleChangeTab(TAB.DASHBOARD)}>
            {i18n.t('dashBoard')}
          </TabMenuItem>
          <Line />
          <TabMenuItem onClick={() => handleChangeTab(TAB.REVENUE)}>
            {i18n.t('revenue')}
          </TabMenuItem>
          <Line />
          <TabMenuItem onClick={() => handleChangeTab(TAB.BOT)}>
            {i18n.t('autoBot')}
          </TabMenuItem>
          <Line />
          <TabMenuItem onClick={() => handleChangeTab(TAB.BURST_GUARD)}>
            {i18n.t('burstTicket')}
          </TabMenuItem>
          <Line />
          <TabMenuItem onClick={() => handleChangeTab(TAB.DEPOSIT)}>
            {i18n.t('deposit')}
          </TabMenuItem>
          <Line />
          <TabMenuItem onClick={logout}>
            {i18n.t('logout')}
          </TabMenuItem>
          <Line />
        </TabMenuBody>
      </Container>
    );
  }
}

TabMenuMobile.propTypes = {
  userInfo: PropsType.object.isRequired,
  handleChangeTab: PropsType.func.isRequired,
  closeMenu: PropsType.func.isRequired,
  logout: PropsType.func.isRequired,
};


export default TabMenuMobile;
