import React, { Component } from 'react';
import PropTypes from 'prop-types';
import images from '../../../../assets/lucImage';
import TitleResult from './TitleResultHorizontal';
import {
  ActionWrapper, BackgroundContact, Image, Image1, ImageWin,
  Image2, DivZero, DivOne, Image4, Wrapper, WrapperBanker, CenterLogo, ImageRight,
  ResultMessage, Crown, ResultBackground, ColorResult, WrapperPlayer,
} from './LayoutResultStyle';

export const ResultState = {
  BankerWin: 1,
  PlayerWin: 2,
  Tie: 3,
};

function getPokerImg(strOrigin) {
  const str = strOrigin || '';
  const img = str.split('card_').toString();
  let resultImg;
  const posPoker = img.substr(2, 2) - 1;
  switch (img.substr(1, 1)) {
    case 'd':
      resultImg = images.diamonds[posPoker];
      break;
    case 'c':
      resultImg = images.clubs[posPoker];
      break;
    case 'h':
      resultImg = images.hearts[posPoker];
      break;
    case 's':
      resultImg = images.spades[posPoker];
      break;
    default:
      resultImg = images.card0;
      break;
  }
  return resultImg;
}

export const getResultState = (data) => {
  const playerPoint = parseInt(data.player, 10);
  const bankerPoint = parseInt(data.banker, 10);
  let state = ResultState.Tie;
  if (playerPoint > bankerPoint) state = ResultState.PlayerWin;
  if (playerPoint < bankerPoint) state = ResultState.BankerWin;

  switch (state) {
    case ResultState.PlayerWin:
      return {
        state,
        background: ColorResult.PlayerWin.background,
        border: ColorResult.PlayerWin.border,
        text: 'P',
      };
    case ResultState.BankerWin:
      return {
        state,
        background: ColorResult.BankerWin.background,
        border: ColorResult.BankerWin.border,
        text: 'B',
      };
    default:
      return {
        state,
        background: ColorResult.Tie.background,
        border: ColorResult.Tie.border,
        text: 'T',
      };
  }
};

export default class LayoutResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotationCoin: 'rotateY(0deg)',
      marginTop: 647, // 500,
      imgPoker1: images.card0,
      imgPoker2: images.card0,
      imgPoker3: images.card0,
      imgPoker4: images.card0,
      imgPoker5: images.card0,
      imgPoker6: images.card0,
      showWin: false,
      opacityMain: 0,
    };
    this.rotationX = this.rotationX.bind(this);
    this.tranFromPositionY = this.tranFromPositionY.bind(this);
    this.enableClose = false;
    this.rotationInterval = null;
    this.transformInterval = null;
  }

  componentDidMount() {
    this.tranFromPositionY();
  }

  componentWillUnmount() {
    this.clearAllEffect();
  }

  clearAllEffect() {
    if (this.transformInterval) {
      clearInterval(this.transformInterval);
      this.transformInterval = null;
    }
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = null;
    }
  }

  rotationX() {
    const { data } = this.props;
    let timer = 0;
    let timeDefaultPoker = 0;
    this.rotationInterval = setInterval(() => {
      timer += 5;
      if (timer >= 90 && timer < 180) {
        timeDefaultPoker = timer - 90;
      } else if (timer === 180) {
        timer = 270;
        timeDefaultPoker = timer;
      } else if (timer > 270) {
        timeDefaultPoker = timer;
      }
      const result = `rotateY(${timeDefaultPoker}deg)`;
      if (timer >= 270) {
        this.setState({
          rotationCoin: result,
          imgPoker1: getPokerImg(data.playerCard.card_1),
          imgPoker2: getPokerImg(data.playerCard.card_2),
          imgPoker3: getPokerImg(data.playerCard.card_3),
          imgPoker4: getPokerImg(data.bankerCard.card_1),
          imgPoker5: getPokerImg(data.bankerCard.card_2),
          imgPoker6: getPokerImg(data.bankerCard.card_3),
          showWin: true,
          opacityMain: 1,
        });
      } else {
        this.setState({
          rotationCoin: result,
        });
      }
      if (timer >= 360) {
        timer = 360;
        clearInterval(this.rotationInterval);
        this.rotationInterval = null;
        this.enableClose = true;
        this.setState({ rotationCoin: 'rotateY(0deg)' });
      }
    }, 10);
  }

  tranFromPositionY() {
    this.enableClose = false;
    const { marginTop } = this.state;
    let timer = marginTop;
    this.transformInterval = setInterval(() => {
      timer -= 5;
      if (timer <= 458) {
        timer = 458;
        this.rotationX();
        clearInterval(this.transformInterval);
        this.transformInterval = null;
      }
      this.setState({
        marginTop: timer,
        opacityMain: timer < 600 ? 1 : 0,
      });
    }, 5);
  }

  backgroundOnClick() {
    const { closeResult } = this.props;
    if (this.enableClose === true) {
      this.clearAllEffect();
      closeResult();
    }
  }

  renderResult(item) {
  }

  render() {
    const {
      rotationCoin, marginTop, imgPoker1, imgPoker2,
      imgPoker3, imgPoker4, imgPoker5, imgPoker6, showWin, opacityMain,
    } = this.state;
    const { data, scale } = this.props;

    const colorState = getResultState(data);
    let poker1 = null;
    let xPoker4 = '';
    if (!data.playerCard.card_1 || data.playerCard.card_1.length > 0) {
      poker1 = (
        <Wrapper id="poker1">
          <WrapperPlayer>
            <Image1 src={imgPoker1} run={rotationCoin} />
          </WrapperPlayer>
          <DivZero>
            <Image2 src={imgPoker2} run={rotationCoin} x="25px" />
            <Image src={imgPoker3} run={rotationCoin} />
          </DivZero>
        </Wrapper>
      );
    } else {
      poker1 = (
        <Wrapper id="poker1">
          <DivZero>
            <Image2 src={imgPoker2} run={rotationCoin} x="112px" />
            <Image src={imgPoker3} run={rotationCoin} />
          </DivZero>
        </Wrapper>
      );
    }
    let poker6 = null;
    if (!data.bankerCard.card_3 || data.bankerCard.card_3.length > 0) {
      xPoker4 = '120px';
      poker6 = (
        <Wrapper id="poker6">
          <DivOne>
            <Image4 src={imgPoker4} run={rotationCoin} x={xPoker4} />
            <ImageRight src={imgPoker5} run={rotationCoin} />
          </DivOne>
          <WrapperBanker>
            <Image1 src={imgPoker6} run={rotationCoin} />
          </WrapperBanker>
        </Wrapper>
      );
    } else {
      xPoker4 = '196px';
      poker6 = (
        <Wrapper id="poker6">
          <DivOne>
            <Image4 src={imgPoker4} run={rotationCoin} x={xPoker4} />
            <Image src={imgPoker5} run={rotationCoin} />
          </DivOne>
        </Wrapper>
      );
    }
    let xYouWin;
    let imgWin = images.tie;
    if (data.player > data.banker) {
      xYouWin = '17px';
      imgWin = images.win;
    } else if (data.player < data.banker) {
      xYouWin = '631px';
      imgWin = images.win;
    } else {
      xYouWin = '205px';
      imgWin = images.tie;
    }

    const isTie = colorState.state === ResultState.Tie;

    const isWin = showWin
      ? <ImageWin id="imgWin" src={imgWin} x={xYouWin} tie={isTie} />
      : null;
    let { turnWin } = data;
    const { winMoneys } = data;
    if (turnWin === null || turnWin === undefined) turnWin = 0;
    return (
      <ResultBackground onClick={() => this.backgroundOnClick()}>
        <ActionWrapper top={`${marginTop * scale}px`} opacity={opacityMain} id="ActionWrapper" scale={scale}>
          <BackgroundContact />
          {poker1}
          {poker6}
          {isWin}
          <TitleResult isPlayer text="P L A Y E R" color="#0000a9" subtext="闲" point={data.player} pointShow={showWin} />
          <TitleResult isPlayer={false} text="B A N K E R" color="#d90000" subtext="庄" right="0" point={data.banker} pointShow={showWin} />
          {
            !isTie && <CenterLogo colors={colorState}>{colorState.text}</CenterLogo>
          }
          {
            (turnWin > 0) && !isTie && (<Crown src={images.crown} alt="crown" />)
          }
          {
            (colorState.state !== ResultState.tie) && (
              <ResultMessage>
                {
                  winMoneys ? winMoneys.map(item => this.renderResult(item)) : ''
                }
              </ResultMessage>
            )
          }
        </ActionWrapper>
      </ResultBackground>
    );
  }
}

LayoutResult.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  closeResult: PropTypes.func.isRequired,
  scale: PropTypes.number,
};

LayoutResult.defaultProps = {
  data: null,
  scale: 1,
};
