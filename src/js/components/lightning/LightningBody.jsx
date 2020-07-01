import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { API_LUC888 } from '../../config/localConfig';
import { images } from '../../theme';
import i18n from '../../i18n/i18n';
import { ButtonCore } from '../mainContainer/mainStyle';
import { PAGE_TYPE } from '../../constants/auth';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';

export const WrapperTop = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("${props => props.src}");
  font-size: ${props => props.fontSize}px;
  background-size: auto 100%;
  min-height: fit-content;
`;

const Body = styled.div`
  position: ${props => (props.locationBottom ? '' : 'absolute')};
  top: 20%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImgLightning = styled.img`
  width: ${props => props.width}em;
  height: unset;
  margin-right: ${props => props.marginRight}em;
`;

const RoundButtonLeft = styled(ImgLightning)`
  cursor: pointer;
  width: 3.15em;
  height: 3.15em;
  // -webkit-animation:spin 8s linear infinite;
  // -moz-animation:spin 8s linear infinite;
  // animation:spin 8s linear infinite;

  // @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); }}
`;

const RoundButtonRight = styled(ImgLightning)`
  cursor: pointer;
  width: 3.15em;
  height: 3.15em;
  // -webkit-animation:spin 8s linear infinite;
  // -moz-animation:spin 8s linear infinite;
  // animation:spin2 8s linear infinite;

  // @keyframes spin2 { 100% { -webkit-transform: rotate(-360deg); transform:rotate(-360deg); }}
`;

const Form = styled.div`
  display: flex;
  width: 100%;
  height: 20em;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ButtonAction = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 30%;
  margin-top: 2em;
`;


const ActionContent = styled.div`
  display: flex;
  margin: 1em;
`;
const WrapperText = styled.div`
  color: white;
`;
const WrapperRegister = styled.div`
  height: 2.5em;
  display: flex;
  align-items: baseline;
`;
const WrapperBotRegister = styled.div`
  font-size: 1.2em;
  display: flex;
  justify-content: center;
}
`;

class LightningBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderButtonAction() {
    const affiliateCode = StorageUtils.getSectionStorageItem(STORAGE_KEYS.affiliateCode);
    let affiliateParam = '';
    if (affiliateCode && affiliateCode !== 'null') {
      affiliateParam = '&ref='.concat(affiliateCode);
    }
    const registerLink = API_LUC888.concat('register?type=fe').concat(affiliateParam);
    return (
      <ButtonAction>
        <ActionContent>
          <RoundButtonLeft
            src={images.iconButtonLightning}
            marginRight={1}
            onClick={() => this.props.onChangePageType(PAGE_TYPE.LOGIN)}
          />
          <ButtonCore
            fontSize="1.5em"
            onClick={() => this.props.onChangePageType(PAGE_TYPE.LOGIN)}
            height="2em"
          >
            {i18n.t('login')}
          </ButtonCore>
        </ActionContent>
        <ActionContent>
          <RoundButtonRight
            src={images.iconButtonLightning}
            marginRight={1}
            onClick={() => window.open(registerLink)}
          />
          <WrapperText>
            <WrapperRegister>
              <ButtonCore
                fontSize="1.5em"
                onClick={() => window.open(registerLink)}
                height="2em"
              >
                {i18n.t('register')}
              </ButtonCore>
            </WrapperRegister>
            <WrapperBotRegister>
              <p>(新規登録)</p>
            </WrapperBotRegister>
          </WrapperText>
        </ActionContent>
      </ButtonAction>
    );
  }

  render() {
    return (
      <Body locationBottom={this.props.locationBottom} id="LightningBody">
        <Form>
          <ImgLightning
            src={images.logoLightning}
            width={14.944}
          />
          {this.renderButtonAction()}
        </Form>
      </Body>
    );
  }
}


LightningBody.defaultProps = {
  locationBottom: false,
};

LightningBody.propTypes = {
  onChangePageType: PropTypes.func.isRequired,
  locationBottom: PropTypes.bool,
};

export default LightningBody;
