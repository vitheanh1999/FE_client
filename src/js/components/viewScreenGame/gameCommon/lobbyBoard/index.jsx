import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import BigRoad from './BigRoad';
import SmallRoad from './SmallRoad';
import BigEyeBoy from './BigEyeBoy';
import BeadPlate from './BeadPlate';
import CockroachPig from './CockroachPig';
import images from '../../../../../assets/lucImage';

export const Wrapper = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: ${props => props.scale * 190}px;
  left: 0;
  right: 0;
  background: transparent;
  margin-left: auto;
  margin-right: auto;
  margin-top: ${props => props.scale * 2.1}px;
  justify-content: flex-end;
`;

export const FexContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: flex-start;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  height: ${props => props.scale * 48}px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: ${props => props.scale * 1}px;
  background-image: url(${images.rightLobbyBackground});
  width: ${props => props.scale * 505}px;
  height: ${props => props.scale * 190}px;
  background-size: 100% 100%;
  margin-top: 1px;
`;

export const BigEyeBoyWrapper = styled.div`
  padding-top: 0;
  padding-bottom: 0;
  height: ${props => props.scale * 47}px;
`;

export const CockroachPigWrapper = styled.div`
  padding-left: 0;
`;

export const ShufflingText = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.scale * 42}px;
  font-weight: bold;
  color: #4f4e4ebd;
`;

export const FakeButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.scale * 49}px;
  height: 100%;
`;

export const FakeBankerWinButton = styled.div`
  width: ${props => props.scale * 49}px;
  height: ${props => props.scale * 95}px;
  background-image: url(${props => (props.startDeal ? images.fakeBankerWin : images.fakeBankerWinGray)});
  background-color: rgb(0, 0, 0);
  background-size: contain;
  background-repeat: no-repeat;
`;

export const FakePlayerWinButton = styled.div`
  width: ${props => props.scale * 49}px;
  height: ${props => props.scale * 95}px;
  background-image: url(${props => (props.startDeal ? images.fakePlayerWin : images.fakePlayerWinGray)});
  background-size: contain;
  background-repeat: no-repeat;
`;

export const HoverButton = styled.div`
  width: ${props => props.scale * 49}px;
  height: ${props => props.scale * 95}px;
  background-color: transparent;
  cursor: ${props => (props.startDeal ? 'pointer' : 'auto')};
  display: flex;

  &:hover {
    background-color: rgba(0, 0, 0, ${props => (props.startDeal ? 0.1 : 0)});
  }

  &:active {
    background-color: rgba(0, 0, 0, ${props => (props.startDeal ? 0.3 : 0)});
  }
`;

export const Dot = styled.div`
  width: ${props => props.scale * 14}px;
  height: ${props => props.scale * props.height}px;
  background-image: url(${props => props.img});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
`;

export const DotWrapper = styled.div`
  width: ${props => props.scale * 49}px;
  height: ${props => props.scale * 65}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: ${props => props.scale * 30}px;
`;

export const reverseColor = (color) => {
  if (color === 'none') return 'none';
  if (color === 'red') return 'blue';
  if (color === 'blue') return 'red';
  return 'none';
};

export const disableShowBigWin = true;

export const ButtonViewBigWin = styled.div`
  width: ${props => props.scale * 16}px;
  height: 100%;
  background: url(${props => (props.showBigWin ? images.less : images.more)});
  background-size: cover;

  &:hover {
    background: url(${props => (props.showBigWin ? images.lessDark : images.moreDark)});
  }
`;

export const renderBigEyeDot = (color, scale) => {
  if (!color) {
    return <div />;
  }

  if (color === 'red') {
    return <Dot img={images.dot.redBorder} height={20} scale={scale} />;
  }

  if (color === 'blue') {
    return <Dot img={images.dot.blueBorder} height={20} scale={scale} />;
  }

  return <div />;
};

export const renderSmallDot = (color, scale) => {
  if (!color) {
    return <div />;
  }

  if (color === 'red') {
    return <Dot img={images.dot.redCircle} height={20} scale={scale} />;
  }

  if (color === 'blue') {
    return <Dot img={images.dot.blueCircle} height={20} scale={scale} />;
  }

  return <div />;
};

export const renderCockroachDot = (color, scale) => {
  if (!color) {
    return <div />;
  }

  if (color === 'red') {
    return <Dot img={images.dot.redLine} height={20} scale={scale} />;
  }

  if (color === 'blue') {
    return <Dot img={images.dot.blueLine} height={20} scale={scale} />;
  }

  return <div />;
};

export const creatDataTest = (arr) => {
  const result = [];
  for (let i = 0; i < arr.length; i += 1) {
    const turn = {
      id: i, b_pair: 0, banker: 0, miss_turn: 0, p_pair: 0, player: 0, tie: 0,
    };
    switch (arr[i]) {
      case 0:
        turn.banker = 1;
        break;
      case 1:
        turn.player = 1;
        break;
      default:
        turn.tie = 1;
        break;
    }

    result.push(turn);
  }
  return result;
};

class LobbyBoard extends Component {
  constructor(props) {
    super(props);
    this.bigRoadRef = React.createRef();
    this.bigEyeRef = React.createRef();
    this.smallRef = React.createRef();
    this.cockroachRef = React.createRef();
    const showBigWin = false;
    this.state = {
      fakePlayerWin: {
        bigEye: 'none',
        small: 'none',
        cock: 'none',
      },
      fakeBankerWin: {
        bigEye: 'none',
        small: 'none',
        cock: 'none',
      },
      showBigWin,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.unFakeLobbyBoar();
    }
  }

  getFakeData() {
    // predict Player win
    const bigEyeColor = this.bigEyeRef.current.predictNextPointColor(true);
    const smallColor = this.smallRef.current.predictNextPointColor(true);
    const cockroachColor = this.cockroachRef.current.predictNextPointColor(true);

    this.setState({
      fakePlayerWin: {
        bigEye: bigEyeColor,
        small: smallColor,
        cock: cockroachColor,
      },
      fakeBankerWin: {
        bigEye: reverseColor(bigEyeColor),
        small: reverseColor(smallColor),
        cock: reverseColor(cockroachColor),
      },
    });
  }

  fakeBankerWin() {
    const { fakeData } = this.props;
    const itemFake = {
      b_pair: 0, banker: 1, id: -9999, p_pair: 0, player: 0, tie: 0,
    };
    fakeData(itemFake);
  }

  fakePlayerWin() {
    const { fakeData } = this.props;
    const itemFake = {
      b_pair: 0, banker: 0, id: -9999, p_pair: 0, player: 1, tie: 0,
    };
    fakeData(itemFake);
  }

  unFakeLobbyBoar() {
    const { unFakeData } = this.props;
    unFakeData();
  }

  blinkFakeLobby(isBankerWin) {
    const { startDeal } = this.props;
    if (!startDeal) return;
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.unFakeLobbyBoar();
    }

    this.blinkCount = 5 * 2;
    this.blinkInterval = setInterval(() => {
      if (this.blinkCount === 1) {
        clearInterval(this.blinkInterval);
      }

      if (this.blinkCount % 2 === 0) {
        if (isBankerWin) {
          this.fakeBankerWin();
        } else {
          this.fakePlayerWin();
        }
      } else {
        this.unFakeLobbyBoar();
      }
      this.blinkCount -= 1;
    }, 500);
  }

  showBigWinOnClick() {
    const { showBigWin } = this.state;
    this.setState({ showBigWin: !showBigWin });
  }

  renderFakePlayerWin() {
    const { fakePlayerWin } = this.state;
    const bigEyeDot = renderBigEyeDot(fakePlayerWin.bigEye, this.props.scale);
    const smallDot = renderSmallDot(fakePlayerWin.small, this.props.scale);
    const cockDot = renderCockroachDot(fakePlayerWin.cock, this.props.scale);
    return (
      <DotWrapper scale={this.props.scale}>
        {bigEyeDot}
        {smallDot}
        {cockDot}
      </DotWrapper>
    );
  }

  renderFakeBankerWin() {
    const { fakeBankerWin } = this.state;
    const bigEyeDot = renderBigEyeDot(fakeBankerWin.bigEye, this.props.scale);
    const smallDot = renderSmallDot(fakeBankerWin.small, this.props.scale);
    const cockDot = renderCockroachDot(fakeBankerWin.cock, this.props.scale);
    return (
      <DotWrapper scale={this.props.scale}>
        {bigEyeDot}
        {smallDot}
        {cockDot}
      </DotWrapper>
    );
  }

  reRenderCanvas() {
    this.bigRoadRef.current.updateParam();
    this.bigEyeRef.current.updateParam();
    this.smallRef.current.updateParam();
    this.cockroachRef.current.updateParam();

    this.bigRoadRef.current.renderCanvas();
    this.bigEyeRef.current.renderCanvas();
    this.smallRef.current.renderCanvas();
    this.cockroachRef.current.renderCanvas();
  }

  render() {
    const {
      lobbyList, startDeal, scale,
    } = this.props;
    return (
      <Wrapper id="LobbyBoard" scale={scale}>
        <FexContainer scale={scale}>
          <BeadPlate
            listData={lobbyList}
            columns={15}
            width={475.667 * scale}
            maxColumnVisible={14}
            scale={scale}
          />
        </FexContainer>
        <Column id="lobbyRight" scale={scale}>
          <BigRoad
            dataOrigin={lobbyList}
            ref={this.bigRoadRef}
            width={505 * scale}
            height={95 * scale}
          />
          <BigEyeBoyWrapper scale={scale}>
            <BigEyeBoy
              dataOrigin={lobbyList}
              ref={this.bigEyeRef}
              width={505 * scale}
              height={47 * scale}
            />
          </BigEyeBoyWrapper>
          <Row scale={scale}>
            <SmallRoad
              dataOrigin={lobbyList}
              ref={this.smallRef}
              width={252 * scale}
              height={48 * scale}
            />
            <CockroachPigWrapper scale={scale}>
              <CockroachPig
                dataOrigin={lobbyList}
                ref={this.cockroachRef}
                scale={scale}
                width={252 * scale}
                height={48 * scale}
              />
            </CockroachPigWrapper>
          </Row>
        </Column>
        {
          (!lobbyList || lobbyList.length === 0)
            ? <ShufflingText scale={scale}>Shuffling</ShufflingText> : null
        }
        <FakeButtonContainer scale={scale}>
          <FakeBankerWinButton onClick={() => this.blinkFakeLobby(true)} startDeal={startDeal} scale={scale}>
            <HoverButton startDeal={startDeal} scale={scale}>{this.renderFakeBankerWin()}</HoverButton>
          </FakeBankerWinButton>
          <FakePlayerWinButton onClick={() => this.blinkFakeLobby(false)} startDeal={startDeal} scale={scale}>
            <HoverButton startDeal={startDeal} scale={scale}>{this.renderFakePlayerWin()}</HoverButton>
          </FakePlayerWinButton>
        </FakeButtonContainer>
      </Wrapper>
    );
  }
}

LobbyBoard.propTypes = {
  lobbyList: PropTypes.arrayOf(PropTypes.any).isRequired,
  // shuffling: PropTypes.bool.isRequired,
  fakeData: PropTypes.func.isRequired,
  unFakeData: PropTypes.func.isRequired,
  startDeal: PropTypes.bool.isRequired,
  scale: PropTypes.number,
};

LobbyBoard.defaultProps = {
  scale: 1,
};

export default LobbyBoard;
