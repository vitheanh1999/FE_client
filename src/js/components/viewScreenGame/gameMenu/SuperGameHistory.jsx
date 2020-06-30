import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Switch from 'react-switch';
import { images } from '../../themes';
import TimeZone from '../../helper/TimeZone';
import Pagination from '../common/Pagination';
import LoadingAnimation from '../common/LoadingVideo';
import { convertNumber } from '../../helper/Utils';
import i18n from '../../i18n/i18n';
import AudioPlayer, { Sounds } from '../common/audio/AudioPlayer';
import ApiErrorUtils from '../../helper/ApiErrorUtils';

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5px;
`;

const Img = styled.img`
  width: 15px;
  height: 15px;
  margin-right: 5px;
`;

export const StyledUncheckedIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 10px;
  color: #186f00;
  padding-right: 2;
  font-weight: bold;
  text-transform: uppercase;
`;

export const StyledCheckedIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 10px;
  color: #186f00;
  padding-left: 2;
  font-weight: bold;
  text-transform: uppercase;
`;

export const StyledSwitch = styled.div`
  display: flex;
  position: absolute;
  justify-content: flex-end;
  align-items: center;
  bottom: 92px;
  right: 200px;
`;

export const RootWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Main = styled.div`
  display: inline-block;
  width: 694px;
  height: 486px;
  background: rgba(8, 9, 9, 0.8);
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  border-width: 2px;
  border-color: rgb(128, 128, 128);
  border-style: solid;

  > div > span {
    color: #35af00;
    padding: 5px;
    font-size: 13px;
  }
`;

export const Header = styled.div`
  display: flex;
  width: 694px;
  height: 46px;
  position: relative;
`;

export const Close = styled.img`
  width: 13px;
  height: 13px;
  right: 0;
  margin-top: 15px;
  margin-right: 15px;
  cursor: pointer;
  top: -2px;
  position: absolute;
`;

export const Title = styled.div`
  color: #35af00;
  font-size: 16px;
  font-weight: 700;
  margin-top: 15px;
  position: absolute;
  left: 0;
  right: 0;
  user-select: none;
  width: 100%;
  text-align: center;
  text-transform: uppercase;
`;

export const Content = styled.div`
  display: flex;
`;

export const UL = styled.ul`
  width: 610px;
  margin-top: 0;
  height: 382px;
  flex-flow: row wrap;
  border: 5px solid #666;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
`;

export const Li = styled.li`
  width: 650px;
  height: 28px;
  display: flex;
  align-items: center;
  margin-left: -40px;
  border-bottom: 0.5px solid #666;
  background: ${props => props.color};
`;

export const HeaderList = styled.div`
  width: 650px;
  height: 40px;
  background: #333;
  display: flex;
  margin-left: -40px;
  align-items: center;
`;

export const TextHeaderList = styled.div`
  color: white;
  width: ${props => props.width};
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  user-select: none;
  text-transform: uppercase;
`;

export const LineRight = styled.div`
  height: 381px;
  width: 1px;
  background: #888;
  position: absolute;
  margin-top: 5px;
  margin-left: ${props => props.left};
`;

export const TextItem = styled.div`
  color: white;
  width: ${props => props.width}px;
  font-size: 12px;
  line-height: 27px;
  text-align: center;
  user-select: none;
`;

export const TextBet = styled.div`
  color: white;
  width: ${props => props.width}px;
  line-height: 27px;
  font-size: 12px;
  text-align: right;
  padding-right: ${props => props.padding}px;
  user-select: none;
`;

export const getSum = (total, num) => (
  total + num
);

export const colorRow = (payoff, index) => {
  if (payoff > 0) {
    return index % 2 === 0 ? '#62775c' : '#54694e';
  }
  return index % 2 === 0 ? '#555' : '#444';
};

export const getBet = betting => (
  Object.values(betting).reduce(getSum)
);

export const itemView = (item, index, chipCategory) => {
  const selectBet = item.select;
  let resultSelect = '';

  if (selectBet.p_pair !== undefined && selectBet.p_pair > 0) {
    resultSelect += ',P.P';
  }
  if (selectBet.banker !== undefined && selectBet.banker > 0) {
    resultSelect += ',B';
  }
  if (selectBet.b_pair !== undefined && selectBet.b_pair > 0) {
    resultSelect += ',B.P';
  }
  if (selectBet.tie !== undefined && selectBet.tie > 0) {
    resultSelect += ',T';
  }
  if (selectBet.player !== undefined && selectBet.player > 0) {
    resultSelect += ',P';
  }
  resultSelect = resultSelect.slice(1, resultSelect.length);
  const itemPayOff = item.payoff > 0 ? `+${convertNumber(item.payoff)}` : convertNumber(item.payoff);
  const url = chipCategory && chipCategory.find(i => i.id === item.chip_category_id)
    && chipCategory.find(i => i.id === item.chip_category_id).icon;

  return (
    <Li key={index} color={colorRow(item.payoff, index)}>
      <TextItem width="134">{item.time}</TextItem>
      <TextItem width="77">{`B(${item.result.banker}) P(${item.result.player})`}</TextItem>
      <TextItem width="85">{resultSelect}</TextItem>
      <TextItem width="83">
        <Item>
          {url && <Img src={url} alt="icon" />}
          {convertNumber(getBet(item.select))}
        </Item>
      </TextItem>
      <TextItem width="155">
        <Item>
          {url && <Img src={url} alt="icon" />}
          {convertNumber(item.after_betting)}
        </Item>
      </TextItem>
      <TextBet width="120">
        <Item>
          {url && <Img src={url} alt="icon" />}
          {itemPayOff}
        </Item>
      </TextBet>
    </Li>
  );
};

let autoLoad;
class SuperGameHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      listHistory: [],
      offset: 12,
      currentPage: 1,
      sumPage: 1,
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.onscroll = this.onscroll.bind(this);
    this.ClickPage = this.ClickPage.bind(this);
  }

  componentDidMount() {
    const { fetchData, nameTable, tableId } = this.props;
    const { offset, currentPage } = this.state;
    this.setLoading(true);
    fetchData(this.onSuccess, this.onError, offset, currentPage, nameTable, TimeZone.getTimeZone(), tableId);

    document.getElementById('demo').onscroll = () => this.onscroll();
  }

  componentWillUnmount() {
    document.getElementById('demo').onscroll = null;
  }

  onscroll() {
    const { currentPage } = this.state;
    autoLoad = 200 * currentPage;
    if (document.getElementById('demo').scrollTop === autoLoad) {
      this.setState({ currentPage: currentPage + 1 }, () => {
        this.updateData();
      });
    }
  }

  onSuccess(data) {
    const { getAlertRef } = this.props;
    const alert = getAlertRef();
    ApiErrorUtils.handleServerError(data, alert, () => {
      this.setLoading(false);
      this.setState({ listHistory: data.data, sumPage: data.last_page });
    });
  }

  onError(error) {
    this.setLoading(false);
    const { getAlertRef } = this.props;
    const alert = getAlertRef();
    ApiErrorUtils.handleHttpError(error, alert);
  }

  setLoading(value) {
    this.setState({ loading: value });
  }

  updateData() {
    const { fetchData, nameTable } = this.props;
    const newData = this.state;
    fetchData(
      this.onSuccess, this.onError, newData.offset,
      newData.currentPage, nameTable, TimeZone.getTimeZone(),
    );
  }

  ClickPage(i) {
    const { currentPage } = this.state;
    if (currentPage !== i) {
      this.setState({ currentPage: i, loading: true }, () => {
        this.updateData();
      });
      AudioPlayer.instance.playSeSound(Sounds.Button);
    }
  }

  render() {
    const {
      closePopup, toggleHistory, isShowHistory, chipCategory,
    } = this.props;
    const {
      listHistory, sumPage, currentPage, loading,
    } = this.state;
    const listTable = listHistory.length > 0
      ? listHistory.map((item, index) => itemView(item, index, chipCategory)) : [];
    const titleTime = `TIME (GMT${TimeZone.getTimeZone()})`;
    const loadingView = loading ? <LoadingAnimation top={186} left={527} /> : null;
    return (
      <RootWrapper>
        <Main id="GameHistory">
          {loadingView}
          <Header>
            <Title>{i18n.t('gameHistory')}</Title>
            <Close
              src={images.iconX}
              onClick={() => {
                closePopup();
                AudioPlayer.instance.playSeSound(Sounds.Button);
              }}
            />
          </Header>
          <Content>
            <UL id="demo">
              <HeaderList>
                <TextHeaderList width="129px">{titleTime}</TextHeaderList>
                <TextHeaderList width="81px">{i18n.t('result')}</TextHeaderList>
                <TextHeaderList width="83px">{i18n.t('select')}</TextHeaderList>
                <TextHeaderList width="87px">{i18n.t('bet')}</TextHeaderList>
                <TextHeaderList width="146px">{i18n.t('afterBetting')}</TextHeaderList>
                <TextHeaderList width="122px">{i18n.t('payOff')}</TextHeaderList>
              </HeaderList>
              {listTable}
            </UL>
            <LineRight left="154px" />
            <LineRight left="232px" />
            <LineRight left="315px" />
            <LineRight left="397px" />
            <LineRight left="552px" />
          </Content>
          <Pagination
            currentPage={currentPage}
            sum={sumPage}
            onChange={(page) => { this.ClickPage(page); }}
          />
          <StyledSwitch>
            <span>{i18n.t('shortHistory')}</span>
            <Switch
              onChange={toggleHistory}
              checked={isShowHistory}
              handleDiameter={20}
              activeBoxShadow="none"
              height={25}
              width={50}
              offHandleColor="#186f00"
              onColor="#fff"
              onHandleColor="#186f00"
              uncheckedIcon={<StyledUncheckedIcon>{i18n.t('off')}</StyledUncheckedIcon>}
              checkedIcon={<StyledCheckedIcon>{i18n.t('on')}</StyledCheckedIcon>}
              className="react-switch"
              id="icon-switch"
            />
          </StyledSwitch>
        </Main>
      </RootWrapper>
    );
  }
}

SuperGameHistory.propTypes = {
  fetchData: PropTypes.func.isRequired,
  closePopup: PropTypes.func.isRequired,
  nameTable: PropTypes.string.isRequired,
  getAlertRef: PropTypes.func.isRequired,
  toggleHistory: PropTypes.func.isRequired,
  isShowHistory: PropTypes.bool.isRequired,
  tableId: PropTypes.number.isRequired,
  chipCategory: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default SuperGameHistory;
