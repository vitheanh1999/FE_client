import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TabItem from './TabItem';
import { TAB } from '../../constants/Constants';
import i18n from '../../i18n/i18n';
import MaintainNotification from './MaintainNotification';
import images from '../../theme/images';

export const Link = styled.a`
  padding: 0.2em 0 0.2em 1em;
  height: auto;
  font-size: 1em;
  color: #fff;

  :hover {
    color: #fff;
  }
`;

export const Copyright = styled.div`
  color: #fff;
  height: 2.6em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 6em;
  background-color: ${props => props.color};
  cursor: pointer;
`;

const Logo = styled.img`
  width: 62%;
  cursor: pointer;
  box-shadow: none;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-size: 88%;
  min-height: fit-content;
  box-shadow: rgba(0, 0, 0, 1) 0 1em 1em 0, rgba(0, 0, 0, 0.75) 0 1em 1em 0;
  overflow: auto;
  overflow-x: hidden;
`;

const Blank = styled.div`
  flex: 1;
`;

export const renderCopyright = () => i18n.t('copyright');

class TabMenu extends Component {
  componentDidMount() { }

  goDashboard() {
    const { onChange } = this.props;
    onChange(TAB.DASHBOARD);
  }

  renderTabItem(item) {
    const { index, onChange, notify } = this.props;
    if (item.isShow) {
      return (
        <TabItem
          key={item.value}
          active={index === item.value}
          title={item.name}
          subTitle={i18n.t(`${item.key}SubTitle`)}
          onClick={() => onChange(item)}
          icon={item.icon}
          unReadNew={notify[item.key] || ''}
        />
      );
    }
    return <div key={item.value} />;
  }

  render() {
    const listKeys = Object.keys(TAB);
    const { maintainInfo } = this.props;
    const hasLogo = true;
    return (
      <Wrapper>
        {
          hasLogo && (
            <LogoArea onClick={() => this.goDashboard()} color="#002e38">
              <Logo
                src={images.logoFE}
                onClick={() => this.props.onChange(TAB.DASHBOARD)}
              />
            </LogoArea>
          )
        }
        {
          listKeys.map(item => this.renderTabItem(TAB[item]))
        }
        <Blank />
        {/* <TabItem
          key={TAB.TERMS.value}
          active={this.props.index === TAB.TERMS.value}
          title={i18n.t(TAB.TERMS.key)}
          onClick={() => this.props.onChange(TAB.TERMS)}
        />
        <TabItem
          key={TAB.POLICY.value}
          active={this.props.index === TAB.POLICY.value}
          title={i18n.t(TAB.POLICY.key)}
          onClick={() => this.props.onChange(TAB.POLICY)}
          fontSize="1em"
        /> */}
        <Link href="/terms" target="_blank">{i18n.t(TAB.TERMS.key)}</Link>
        <Link href="/privacy" target="_blank">{i18n.t(TAB.POLICY.key)}</Link>
        {maintainInfo && <MaintainNotification maintainInfo={maintainInfo} />}
        <Copyright>
          {renderCopyright()}
        </Copyright>
      </Wrapper>
    );
  }
}

TabMenu.defaultProps = {
  maintainInfo: {},
};

TabMenu.propTypes = {
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  maintainInfo: PropTypes.object,
  notify: PropTypes.object.isRequired,
};

export default TabMenu;
