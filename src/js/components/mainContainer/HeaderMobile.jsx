import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Wrapper, LeftCell, Logo, CenterCell, Title,
  RightCell, MenuButton,
} from './headerStyleMobile';
import images from '../../theme/images';
import { TAB } from '../../constants/Constants';

class HeaderMobile extends PureComponent {
  render() {
    const {
      companyInfo,
      screenName,
      onClickMenu,
      handleChangeTab,
    } = this.props;
    return (
      <Wrapper>
        <LeftCell flex={26}>
          <Logo src={companyInfo.miniLogo} alt="logo" onClick={() => handleChangeTab(TAB.DASHBOARD)} />
        </LeftCell>
        <CenterCell flex={48}>
          <Title style={{ fontWeight: 700 }}>{screenName}</Title>
        </CenterCell>
        <RightCell flex={26}>
          <MenuButton src={images.menuIcon} alt="menu" onClick={onClickMenu} />
        </RightCell>
      </Wrapper>
    );
  }
}

HeaderMobile.propTypes = {
  companyInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  screenName: PropTypes.string.isRequired,
  onClickMenu: PropTypes.func.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
};

HeaderMobile.defaultProps = {

};

export default HeaderMobile;
