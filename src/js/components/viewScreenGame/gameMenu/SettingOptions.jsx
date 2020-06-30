import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { images } from '../../themes';
import GameHistory from './GameHistory';
import i18n from '../../i18n/i18n';
import MyPage from '../../containers/myPage/MyPage';
import AudioPlayer, { Sounds } from '../common/audio/AudioPlayer';

const Wrap = styled.div`
  width : 1060px;
  height: 1px;
  position: absolute;
  margin-left: -743px;
  top: 0;
  margin-top: -38px;
  z-index: 11;
`;

const Main = styled.div`
  display: inline-block; right:0; left: 0;
  margin-right: auto; margin-left: auto; width: 100%;
`;
const ButtonHistory = styled.button`
  text-transform: uppercase; width: 270px; height: 43px; background: white;
  color: #298500; border: 0; margin: 0 auto; border-radius: 5px;
  cursor: pointer; font-size: 16px; display: grid; align-items: center;
  margin-top: 10px; margin-bottom: 20px; font-weight: 600;

  &: hover {
    border-left: 2px solid #888;
    border-right: 2px solid #888;
    border-bottom: 2px solid #888;
    border-top: 2px solid #888;
  }
`;

const ButtonMyPage = styled.button`
  text-transform: uppercase; height: 43px; width: 270px; background: white;
  color: #298500; margin: 0 auto; border: 0; border-radius: 5px; cursor:pointer;
  font-size: 16px; display:grid; align-items:center;margin-top: 10px;
  margin-bottom: 20px; font-weight: 600; background-image: url(${images.settingMyPage});
  background-position: 180px center;
  background-repeat: no-repeat;

  &: hover {
    border-left: 2px solid #888;
    border-right: 2px solid #888;
    border-bottom: 2px solid #888;
    border-top: 2px solid #888;
  }
`;

class SettingOptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showHistory: false,
      showMyPage: false,
    };

    this.onPressGameHistory = this.onPressGameHistory.bind(this);
    this.onPressMyPage = this.onPressMyPage.bind(this);
    this.onPressCloseMyPage = this.onPressCloseMyPage.bind(this);
  }

  componentDidMount() {
  }

  onPressGameHistory() {
    this.setState({ showHistory: true, showMyPage: false });
    AudioPlayer.instance.playSeSound(Sounds.Button);
  }

  onPressMyPage() {
    this.setState({ showHistory: false, showMyPage: true });
    AudioPlayer.instance.playSeSound(Sounds.Button);
  }

  onPressCloseMyPage() {
    this.setState({ showMyPage: false });
  }

  renderHistoryPopup() {
    const { showHistory } = this.state;
    const { nameTable } = this.props;

    if (showHistory) {
      return (
        <GameHistory
          closePopup={() => this.setState({ showHistory: false })}
          nameTable={nameTable}
        />
      );
    }
    return null;
  }

  renderMyPagePopup() {
    const { showMyPage } = this.state;
    if (showMyPage) {
      return <MyPage type="popup" onClose={this.onPressCloseMyPage} />;
    }
    return null;
  }

  render() {
    return (
      <Main>
        <Wrap>
          {this.renderHistoryPopup()}
          {this.renderMyPagePopup()}
        </Wrap>
        <ButtonHistory
          onClick={this.onPressGameHistory}
        >
          {i18n.t('gameHistory')}
        </ButtonHistory>
        <ButtonMyPage
          onClick={this.onPressMyPage}
        >
          {i18n.t('myPage')}
        </ButtonMyPage>
      </Main>
    );
  }
}
SettingOptions.propTypes = {
  nameTable: PropTypes.string.isRequired,
};


export default SettingOptions;
