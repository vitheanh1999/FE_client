import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import images from '../../../../assets/lucImage';
import TextNumber from '../animations/TextNumber';
import AnimationChip from '../gameTable/AnimationChip';

const UserName = styled.div`
  display: flex;
`;

const Wrapper = styled.div`
  position: absolute;
  top: ${props => props.scale * 5}px;
  left: ${props => props.scale * (props.isOff ? 12 : 508)}px;
  opacity: 0.9;
`;

const Row = styled.div`
  display: flex;
  margin: ${props => props.margin || 0};
  flex-direction: row;
  align-items: center;
  ${props => (props.width ? `width: ${props.width}px` : '')};
`;

const ImgUser = styled.div`
  width: ${props => props.scale * 17}px;
  height: ${props => props.scale * 19}px;
  background-image: url(${images.UserIconSprite});
  cursor: pointer;
  background-size: 100% 100%;
`;

export const ImgMoney = styled.div`
  width: ${props => props.scale * 17}px;
  height: ${props => props.scale * 17}px;
  background-image: url(${props => props.icon});
  background-size: cover;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-left: 10px;

  &:first-child {
    margin-left: 0;
  }
`;

const Text = styled.div`
  font-size: ${props => props.scale * 16}px;
  color: white;
  margin-left: ${props => props.scale * 10}px;
  font-weight: 600;
  cursor: pointer;
`;

const BuyButton = styled.button`
  border: none;
  margin-left: 10px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  font-size: 12px;
  padding: 2px 10px;
  cursor: pointer;
  font-weight: 500;

  &: hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const Flex = styled.div`
  flex: 1;
`;

const ButtonEventRanking = styled.div`
  height: 22px;
  background-color: rgba(0, 0, 0, 0.6);
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  font-size: 13px;
  position: relative;
  padding-left: 15px;
  padding-right: 8px;
  cursor: pointer;
`;

const IconCat = styled.img`
  height: 38px;
  position: absolute;
  left: -12px;
  top: -10px;
  cursor: pointer;
`;

const IconRank = styled.img`
  height: 21px;
  margin-bottom: 1px;
`;

const GcText = styled.span`
  color: white;
  margin-left: ${props => props.scale * 0.5}em;
  font-size: ${props => props.scale}em;
`;

const Span = styled.span`
  white-space: pre-wrap;
`;

const showMyPagePopup = (data) => {
  if (data.gotoMyPage) data.gotoMyPage();
};

export default class UserInfo extends React.PureComponent {
  componentDidMount() {

  }

  handleChangeCheckBox(id) {
    const { handleChangeSelectChip } = this.props;
    handleChangeSelectChip(id);
  }

  renderEvent() {
    const { eventData } = this.props;
    if (!eventData) return <div />;
    const rankIndex = eventData.ranking >= 0 ? eventData.ranking : 'N/a';
    const betTimes = eventData.betting_time ? eventData.betting_time : 0;
    const text = `現在のイベント順位：${rankIndex} | BET回数：${betTimes}`;
    return (
      <ButtonEventRanking id="LinkEventRanking" onClick={eventData.goEventRanking}>
        <IconCat src={images.smallCat} />
        <IconRank src={images.icRanking} />
        {text}
      </ButtonEventRanking>
    );
  }

  render() {
    const {
      scale, // tableChipTypes
      botInfo,
      currentMoney,
    } = this.props;

    const userName = botInfo.name;
    let chipValue = 95900;
    if (botInfo) {
      if (currentMoney === null || currentMoney === undefined) {
        chipValue = botInfo.GC;
      } else {
        chipValue = currentMoney;
      }
    }

    const totalChip = [
      {
        id: 1,
        name: 'General GC',
        unit: 'GC',
        url_icon: 'https://luc888-api-public-resource.s3.ap-southeast-1.amazonaws.com/images/1564585836gc.png',
        value: chipValue,
      },
    ];

    return (
      <Wrapper id="UserInfo" scale={scale} isOff={!botInfo.status}>
        <Row>
          <UserName onClick={() => showMyPagePopup(data)}>
            <ImgUser scale={scale} />
            <Text scale={scale}>{userName}</Text>
          </UserName>
        </Row>
        <Row ref={AnimationChip.userChipRef}>
          {
            totalChip.map(item => (
              <React.Fragment key={item.id}>
                <ImgMoney
                  id={`chip-type-${item.id}`}
                  icon={item.url_icon}
                  onClick={() => this.handleChangeCheckBox(item.id)}
                  scale={scale}
                />
                <Span>{' '}</Span>
                <TextNumber
                  height={30 * scale}
                  size={14 * scale}
                  color="white"
                  value={item.value || 0}
                  marginLeft="3px"
                  onClick={() => this.handleChangeCheckBox(item.id)}
                />
                <GcText scale={scale}>GC</GcText>
              </React.Fragment>
            ))
          }
          <Flex />
        </Row>
      </Wrapper>
    );
  }
}

UserInfo.propTypes = {
  eventData: PropTypes.objectOf(PropTypes.any),
  handleChangeSelectChip: PropTypes.func,
  scale: PropTypes.number,
  botInfo: PropTypes.objectOf(PropTypes.any),
  currentMoney: PropTypes.number,
};

UserInfo.defaultProps = {
  eventData: null,
  handleChangeSelectChip: () => { },
  scale: 1,
  botInfo: null,
  currentMoney: null,
};
