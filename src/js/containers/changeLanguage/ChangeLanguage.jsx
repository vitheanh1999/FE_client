import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import iconX from '../../../assets/imgs/icon_x.png';
import i18n from '../../i18n/i18n';
import {
  Wrapper, AlertStyled, CloseButton,
  Title, WrapperFlag, Flag, ImageFlag, NameFlag, ButtonSelect,
} from './ChangeLanguageStyle';
import StorageUtils from '../../helpers/StorageUtils';
import { LANGUAGE } from '../../constants/language';
import * as languageAction from '../../actions/language';
import { calculatorFontSize } from '../login/SuperLogin';

class ChangeLanguage extends Component {
  constructor(props) {
    super(props);
    ChangeLanguage.instance = this;
    const currentLang = StorageUtils.getItem('i18nextLng');
    const index = LANGUAGE.findIndex(item => item.value === currentLang.substr(0, 2));
    let currentId = -1;
    if (index !== -1) {
      currentId = LANGUAGE.find(item => item.value === currentLang.substr(0, 2)).id;
    }
    this.state = {
      onAnimation: false,
      currentId,
    };
  }

  componentDidMount() {
  }

  handleChangeLanguage() {
    const { changeLanguage, onClose } = this.props;
    const { currentId } = this.state;
    const lang = LANGUAGE.find(item => item.id === currentId).value;
    i18n.changeLanguage(lang);
    changeLanguage(lang);
    onClose();
  }

  render() {
    const {
      onAnimation, currentId,
    } = this.state;
    const { isShow, onClose } = this.props;
    if (!isShow) {
      return null;
    }
    return (
      <Wrapper className="alertClass">
        <AlertStyled
          isAnimation={onAnimation}
          id="Alert"
          fontSize={calculatorFontSize()}
        >
          <CloseButton
            src={iconX}
            onClick={onClose}
          />
          <Title>{i18n.t('language')}</Title>
          <WrapperFlag>
            {LANGUAGE.map(item => (
              <Flag onClick={() => this.setState({ currentId: item.id })}>
                <ImageFlag src={item.squareIcon} isActived={currentId === item.id} />
                <NameFlag>{item.text}</NameFlag>
              </Flag>
            ))}
          </WrapperFlag>
          <ButtonSelect onClick={() => this.handleChangeLanguage()}>
            {i18n.t('button.select')}
          </ButtonSelect>
        </AlertStyled>
      </Wrapper>
    );
  }
}

ChangeLanguage.propTypes = {
  changeLanguage: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isShow: PropTypes.bool,
};

ChangeLanguage.defaultProps = {
  isShow: false,
};

const mapDispatchToProps = dispatch => ({
  changeLanguage: bindActionCreators(languageAction.settingLanguage, dispatch),
});

export default connect(null, mapDispatchToProps)(ChangeLanguage);
