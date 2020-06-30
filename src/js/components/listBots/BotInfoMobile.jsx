import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import i18n from '../../i18n/i18n';
import images from '../../theme/images';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #f4f3f2;
`;

const GCTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1em;
  padding-bottom: 1em;
`;

const LabelStyled = styled.span`
  font-size: ${props => (props.fontSize ? props.fontSize : 1)}em;
  margin-bottom: 0;
`;

export const ImageStyled = styled.img`
  width: ${props => props.scale * 3.5}em;
  margin-bottom: .5em;
`;

export const KeyStatusBtn = styled.div`
  width: ${props => props.scale * 6}em;
  height: ${props => props.scale * 1.7}em;
  background-color: ${props => (props.isBotOn ? '#31ae00' : '#d00000')};
  border-radius: ${props => props.scale * 0.3}em;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;

  >img {
    width: ${props => props.scale}em;
    margin-right: ${props => props.scale * 0.2}em;
  }
`;

const WrapperBotStatus = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const BotStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TextStyled = styled.div`
  font-size: ${props => props.fontSize}em;
`;

class BotInfoMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.fetchUser(() => { }, () => { });
  }

  render() {
    const { currentUser } = this.props;
    const scale = window.innerWidth / 320;

    return (
      <Wrapper>
        <GCTitle>
          <div>
            <LabelStyled fontSize={1.1 * scale} style={{ marginRight: '0.5em' }}>
              {i18n.t('totalGCInMobile')}:
            </LabelStyled>
            <LabelStyled fontSize={scale * 0.8}>
              {
                currentUser.detail.GC
                  ? `${currentUser.detail.GC.toLocaleString('ja')}GC`
                  : ''
              }
            </LabelStyled>
          </div>
        </GCTitle>
        <WrapperBotStatus>
          <BotStatus>
            <KeyStatusBtn scale={scale} isBotOn>
              <img src={images.iconStatusOn} alt="" />
              <TextStyled fontSize={scale * 0.8}>{i18n.t('onStatus')}</TextStyled>
            </KeyStatusBtn>
            <TextStyled fontSize={scale * 0.8}>{currentUser.detail.bot_on || ''}</TextStyled>
          </BotStatus>
          <BotStatus>
            <KeyStatusBtn scale={scale} isBotOn={false}>
              <img src={images.iconOff} alt="" />
              <TextStyled fontSize={scale * 0.8}>{i18n.t('offStatus')}</TextStyled>
            </KeyStatusBtn>
            <TextStyled fontSize={scale * 0.8}>{currentUser.detail.bot_off || ''}</TextStyled>
          </BotStatus>
        </WrapperBotStatus>
      </Wrapper>
    );
  }
}

BotInfoMobile.propTypes = {
  currentUser: PropTypes.object.isRequired,
  fetchUser: PropTypes.func.isRequired,
};

export default BotInfoMobile;
