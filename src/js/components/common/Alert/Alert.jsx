import React, { Component } from 'react';
import iconX from '../../../../assets/imgs/icon_x.png';
import i18n from '../../../i18n/i18n';
import {
  Wrapper, AlertStyled, CloseButton,
  Content, Title, Message, ButtonWrapper, Button,
} from './alertStyle';
import { ORIENT, getOrientation } from '../../../helpers/orientation';
import AlertStack from './AlertStack';

const buttonBgColors = ['#1289C4', '#23B083'];
const defaultBtnsText = [i18n.t('cancel'), i18n.t('OK')];

class Alert extends Component {
  constructor(props) {
    super(props);
    Alert.instance = this;
    this.state = {
      isShow: false,
      title: '',
      buttonsText: '',
      message: '',
      buttonsClick: null,
      onClose: null,
      orientation: getOrientation(),
      onAnimation: false,
      isShowBanUser: false,
    };

    this.hideAlert = this.hideAlert.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
    this.onOrientationChange = this.onOrientationChange.bind(this);
    window.addEventListener('orientationchange', this.onOrientationChange);
  }

  componentDidMount() {
  }

  onOrientationChange() {
    const newOrientation = getOrientation();
    const { orientation } = this.state;
    if (orientation !== newOrientation) {
      this.setState({ orientation: newOrientation });
    }
  }

  handleAnimationEnd() {
    this.setState({ onAnimation: false });
  }

  showAlert(title, message, buttonsText = 'OK', buttonsClick = () => this.hideAlert(), onClose = null) {
    const state = {
      title,
      message,
      buttonsText,
      buttonsClick,
      onClose,
      isShow: true,
      onAnimation: true,
      isShowBanUser: false,
    };
    AlertStack.push(state);
    this.setState({ ...state });
  }

  showAlertTwoButtons(title, message, buttonsText = defaultBtnsText,
    buttonsClick = [() => this.hideAlert(), null], onClose = null) {
    this.setState({
      title,
      message,
      buttonsText,
      buttonsClick,
      isShow: true,
      onClose,
      isShowBanUser: false,
    });
  }

  showAlertConfirmAction(message, buttonsClick = [() => this.hideAlert(), null], onClose = null) {
    this.setState({
      title: i18n.t('warning'),
      message,
      buttonsText: [i18n.t('cancel'), i18n.t('OK')],
      buttonsClick,
      isShow: true,
      onClose,
      isShowBanUser: false,
    });
  }

  showBanUser() {
    this.setState({
      isShow: true,
      title: i18n.t('warning'),
      message: '',
      buttonsText: 'OK',
      buttonsClick: () => this.hideAlert(),
      onClose: null,
      isShowBanUser: true,
    });
  }

  showAlertConfirmError(message) {
    this.showAlert(
      i18n.t('warning'),
      message,
      i18n.t('OK'),
      () => {
        Alert.instance.hideAlert();
      },
      Alert.instance.hideAlert(),
    );
  }

  hideAlert() {
    AlertStack.pop();
    const oldAlert = AlertStack.get();
    this.setState({ ...oldAlert });
  }

  renderButtons() {
    const { buttonsClick, buttonsText } = this.state;
    let buttons = null;
    if (typeof buttonsText === 'string') {
      buttons = (
        <Button
          onClick={buttonsClick}
          key={Math.random()}
          bgColor="#23B083"
        >{buttonsText}
        </Button>
      );
    } else if (Array.isArray(buttonsText)) {
      buttons = buttonsText.map((text, index) => (
        <Button
          onClick={buttonsClick ? buttonsClick[index] : null}
          key={Math.random()}
          bgColor={buttonBgColors[index]}
        >{text}
        </Button>
      ));
    }

    return (
      <ButtonWrapper>
        {buttons}
      </ButtonWrapper>
    );
  }

  render() {
    const {
      title, message, onClose,
      orientation, isShow, onAnimation, isShowBanUser,
    } = this.state;
    const width = orientation === ORIENT.HORIZONTAL ? '36em' : '80%';

    if (!isShow) {
      return null;
    }
    return (
      <Wrapper className="alertClass">
        <AlertStyled
          onAnimationEnd={this.handleAnimationEnd}
          isAnimation={onAnimation}
          width={width}
          id="Alert"
        >
          <CloseButton
            src={iconX}
            onClick={onClose ? () => onClose() : () => this.hideAlert()}
          />
          <Content>
            <Title>{(title && title.trim().length > 0) ? title : ''}</Title>
            <Message>{(message && message.trim().length > 0) ? message.replace(/\\n/g, '\n') : ''}</Message>
            {
              isShowBanUser ? (
                <div style={{ color: '#fff', whiteSpace: 'pre-wrap', textAlign: 'center' }}>
                  {i18n.t('banUserContent1')}
                  <a
                    style={{ color: '#178ce7' }}
                    href="https://luc888.mojohelpdesk.com/help/article/226327"
                    target="_blank"
                    without
                    rel="noopener noreferrer"
                  >
                    {i18n.t('banUserLink')}
                  </a>
                  {i18n.t('banUserContent2')}
                </div>
              ) : null
            }
          </Content>
          {this.renderButtons()}
        </AlertStyled>
      </Wrapper>
    );
  }
}

export default Alert;
