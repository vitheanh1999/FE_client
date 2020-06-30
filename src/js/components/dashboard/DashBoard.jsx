import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  WrapperQuickView, WrapperContent, Container, Img, Blank,
} from './DashBoardStyle';
import { ContentHeader, MedianStrip } from '../common/CommonStyle';
import i18n from '../../i18n/i18n';
import QuickViewAutoBot from './QuickViewAutoBot';
import QuickViewRevenue from './QuickViewRevenue';
import {
  FORMAT_DATE_TIME, SORT_BOT_OPTIONS, DEFAULT_DATE_DIFF, ALL_PAGE, TAB,
} from '../../constants/Constants';
import images from '../../theme/images';
import Spinner from '../common/Spinner';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Alert from '../common/Alert/Alert';
import { ENABLE_NEWS } from '../../config/localConfig';

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    dayjs.extend(utc);

    const startDate = dayjs.utc().subtract(DEFAULT_DATE_DIFF, 'day').format(FORMAT_DATE_TIME);
    const endDate = dayjs.utc().format(FORMAT_DATE_TIME);
    const params = {
      currentPage: 1,
      perPage: ALL_PAGE,
      sortBy: SORT_BOT_OPTIONS[0].value,
    };
    const paramPayoff = {
      botId: -1,
      startDate,
      endDate,
    };
    this.props.fetchBotHistory(paramPayoff, this.onSuccess, this.onError);
    this.props.fetchListBots(this.onSuccess, this.onError, params);
    if (ENABLE_NEWS) {
      this.props.fetchListNews(
        { currentPage: 1, perPage: 10 },
        this.onSuccess, this.onError,
      );
    }
    this.setState({ isLoading: true });
  }

  componentWillUnmount() { }

  onSuccess() {
    this.setState({
      isLoading: false,
    });
  }

  onError(error) {
    this.setState({
      isLoading: false,
    });
    ApiErrorUtils.handleHttpError(
      error,
      Alert.instance,
    );
  }

  render() {
    const { isLoading } = this.state;
    const { listBots, handleChangeTab, portrait } = this.props;
    return (
      <Container>
        <Blank height={1.1} />
        <WrapperContent flexDirection={portrait ? 'column' : 'row'}>
          <WrapperQuickView portrait={portrait}>
            <QuickViewRevenue
              chartData={listBots.history.data}
              handleChangeTab={handleChangeTab}
            />
          </WrapperQuickView>
          <Blank width={1} height={1} />
          <WrapperQuickView portrait={portrait}>
            <QuickViewAutoBot
              listBots={listBots.bots}
              handleChangeTab={handleChangeTab}
            />
          </WrapperQuickView>
        </WrapperContent>
        <Blank height={1} />
        <WrapperContent flexDirection={portrait ? 'column' : 'row'}>
          <WrapperQuickView portrait={portrait}>
            <ContentHeader>
              {i18n.t('menu.campaign')}
              <Img src={images.btnDetail} onClick={() => handleChangeTab(TAB.CAMPAIGN)} />
            </ContentHeader>
            <MedianStrip />
          </WrapperQuickView>
          <Blank width={1} height={1} />
          <WrapperQuickView portrait={portrait}>
            <ContentHeader>
              {i18n.t('charge')}
              <Img src={images.btnDetail} onClick={() => handleChangeTab(TAB.CHARGE)} />
            </ContentHeader>
            <MedianStrip />
          </WrapperQuickView>
        </WrapperContent>
        <Blank height={1} />
        <Spinner idLoading={isLoading} />
      </Container>
    );
  }
}

DashBoard.defaultProps = {
  listBots: {},
};

DashBoard.propTypes = {
  fetchListBots: PropTypes.func.isRequired,
  fetchBotHistory: PropTypes.func.isRequired,
  fetchListNews: PropTypes.func.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
  listBots: PropTypes.object,
  portrait: PropTypes.bool.isRequired,
};

export default DashBoard;
