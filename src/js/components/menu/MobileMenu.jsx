import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import i18n from '../../i18n/i18n';
import {
  WrapperMenu, TabItem, Img, Logo, WrapperTabItem, LogoWrapper, CloseIcon,
} from './MobileMenuStyle';
import images from '../../../assets/images';
import imagesMobile from '../../theme/imagesMobile';
import imgs from '../../theme/images';
import { TAB } from '../../constants/Constants';
import { IconContent, Round } from './TabItem';
import StorageUtils from '../../helpers/StorageUtils';
import { LANGUAGE } from '../../constants/language';
import ChangeLanguage from '../../containers/changeLanguage/ChangeLanguage';
import { ENABLE_CHANGE_LANGUAGE } from '../../config';

const SelectLangWrapper = styled.div`
  z-index: 1;
  padding: 1em;
  width: 10em;
`;

const Flag = styled.img`
  width: 8em;
  border-radius: 0.8em
`;

export const renderCopyright = () => i18n.t('copyright');

class MobileMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
    };

    this.onChangeTab = this.onChangeTab.bind(this);
  }

  componentDidMount() { }

  onChangeTab(tab) {
    const { handleChangeTab } = this.props;
    handleChangeTab(tab);
  }

  closeMenuTab() {
    this.props.closeMenuTab();
  }

  handleLogout() {
    this.props.logout();
  }

  renderTabItem(item) {
    const { activeTab, notify } = this.props;
    const {
      isShow, value,
      key, icon,
    } = item;
    if (isShow) {
      return (
        <WrapperTabItem key={value} isSelected={activeTab.value === value}>
          <TabItem
            onClick={() => this.onChangeTab(item)}
            isSelected={activeTab.value === value}
          >
            {i18n.t(key)}
            <IconContent>
              <Img src={icon} alt={key} />
              {
                notify[key] ? (<Round>{notify[key]}</Round>) : ''
              }
            </IconContent>
          </TabItem>
        </WrapperTabItem>
      );
    }
    return <div key={item.value} />;
  }

  render() {
    const { fontSize } = this.props;
    const { isShow } = this.state;
    const listKeys = Object.keys(TAB);
    const currentLang = StorageUtils.getItem('i18nextLng');
    const index = LANGUAGE.findIndex(item => item.value === currentLang.substr(0, 2));
    let flag = LANGUAGE[1].icon;
    if (index !== -1) {
      flag = LANGUAGE.find(item => item.value === currentLang.substr(0, 2)).icon;
    }
    return (
      <>
        <WrapperMenu fontSize={fontSize * 1.5} id="MobileMenu">
          <LogoWrapper>
            <CloseIcon src={imagesMobile.iconXWhite} width="1.5em" alignSelf="flex-end" onClick={() => this.closeMenuTab()} />
            <Logo src={imgs.logoFE} alt="logo" onClick={() => this.onChangeTab(TAB.DASHBOARD)} />
          </LogoWrapper>
          {listKeys.map(item => this.renderTabItem(TAB[item]))}
          <WrapperTabItem>
            <TabItem onClick={() => this.handleLogout()}>
              <Img src={images.iconLogout} alt="" />
              {i18n.t('logout')}
            </TabItem>
          </WrapperTabItem>
        </WrapperMenu>
        {
          ENABLE_CHANGE_LANGUAGE && (
            <SelectLangWrapper>
              <Flag src={flag} onClick={() => this.setState({ isShow: true })} />
            </SelectLangWrapper>
          )
        }
        <ChangeLanguage isShow={isShow} onClose={() => this.setState({ isShow: false })} />
      </>
    );
  }
}

MobileMenu.defaultProps = {
  fontSize: 20,
};

MobileMenu.propTypes = {
  handleChangeTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  closeMenuTab: PropTypes.func.isRequired,
  fontSize: PropTypes.number,
  logout: PropTypes.func.isRequired,
  notify: PropTypes.object.isRequired,
};

export default MobileMenu;
