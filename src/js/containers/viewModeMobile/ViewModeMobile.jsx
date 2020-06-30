import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { socketConnectionDashboard } from '../../components/viewScreenGame/Utils';
import {
  Wrapper, Row, ButtonClose, Icon, TextName,
} from './viewModeMobileStyle';
import { imagesMobile } from '../../theme';
import TextNumber from '../../components/viewScreenGame/animations/TextNumber';
import VideoMobile from '../../components/viewModeMobile/VideoMobile';
import SelectTab, { TAB_VIEW_MODE } from '../../components/viewModeMobile/SelectTab';

class ViewModeMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMoney: null,
      selectedTab: TAB_VIEW_MODE.HISTORY,
    };

    this.socket = socketConnectionDashboard;
    this.onChangeTab = this.onChangeTab.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onChangeTab(selectTab) {
    const { selectedTab } = this.state;
    if (selectedTab !== selectTab) {
      this.setState({ selectedTab: selectTab });
    }
  }

  renderUserInfo() {
    const { botInfo } = this.props;
    const { currentMoney } = this.state;

    const userName = botInfo ? botInfo.dbac_code : 'username';
    let chipValue = 10000;
    if (botInfo) {
      if (currentMoney === null || currentMoney === undefined) {
        chipValue = botInfo.GC;
      } else {
        chipValue = currentMoney;
      }
    }

    return (
      <React.Fragment>
        <Row height={1.5} left={0.5}>
          <Icon src={imagesMobile.iconUser} alt="" width={1} height={1} />
          <TextName left={0.4} color="#90cb77">{userName}</TextName>
        </Row>
        <Row height={1.5} left={0.5}>
          <Icon src={imagesMobile.iconCoin} alt="" width={1} height={1} />
          <TextNumber
            height="1.1em"
            size="100%"
            color="#90cb77"
            value={chipValue}
            marginLeft="0.4em"
          />
          <TextName left={0.4} color="#90cb77">GC</TextName>
        </Row>
      </React.Fragment>
    );
  }

  render() {
    const { closeViewMode } = this.props;
    const { selectedTab } = this.state;
    return (
      <Wrapper>
        <ButtonClose
          src={imagesMobile.iconXWhite}
          onClick={closeViewMode}
        />
        { this.renderUserInfo() }
        <VideoMobile />
        <SelectTab
          selectedTab={selectedTab}
          changeTab={this.onChangeTab}
        />
      </Wrapper>
    );
  }
}

ViewModeMobile.propTypes = {
  closeViewMode: PropTypes.func,
  botInfo: PropTypes.objectOf(PropTypes.any),
};

ViewModeMobile.defaultProps = {
  closeViewMode: null,
  botInfo: null,
};

export default ViewModeMobile;
