import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  ContentContainer, ContentHeader, MedianStrip, SpanTotal,
} from '../common/CommonStyle';
import i18n from '../../i18n/i18n';
import { BodyContent, WrapperDropDown } from './RevenueStyle';
import RevenueChart from './RevenueChart';
import RevenueHistoryTable from './RevenueHistoryTable';
import DropDown from '../common/Dropdown/Dropdown';
import {
  SORT_BOT_OPTIONS, DEFAULT_DATE_DIFF,
  ALL_PAGE, FORMAT_DATE_TIME,
} from '../../constants/Constants';
import Alert from '../common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Spinner from '../common/Spinner';
import StyleNumber from '../StyleNumber';

export const MathRound = number => (Math.round(number * 10) / 10);
class Revenue extends Component {
  constructor(props) {
    super(props);
    dayjs.extend(utc);

    this.state = {
      startDate: dayjs.utc().subtract(DEFAULT_DATE_DIFF, 'day').format(FORMAT_DATE_TIME),
      endDate: dayjs.utc().format(FORMAT_DATE_TIME),
      isLoading: false,
      idsSelected: -1,
    };

    this.isUpdateEndDate = false;
    this.onError = this.onError.bind(this);
    this.fetchChartData = this.fetchChartData.bind(this);
    this.fetchPayOffHistory = this.fetchPayOffHistory.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeSelectDropDown = this.onChangeSelectDropDown.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onSuccessChartData = this.onSuccessChartData.bind(this);
  }

  componentDidMount() {
    this.fetchChartData();
    this.fetchPayOffHistory();
    const params = {
      currentPage: 1,
      perPage: ALL_PAGE,
      sortBy: SORT_BOT_OPTIONS[0].value,
      isDeleted: 1,
    };
    this.props.fetchListBot(this.onSuccess, this.onError, params);
  }

  onSuccess(data) {
    this.setState({
      isLoading: false,
    });
    ApiErrorUtils.handleServerError(data, Alert.instance, () => { });
  }

  onSuccessChartData(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      try {
        if (this.isUpdateEndDate === false) {
          const endDate = dayjs(data.data.updated_at).format(FORMAT_DATE_TIME);
          const startDate = dayjs(data.data.updated_at).subtract(DEFAULT_DATE_DIFF, 'day').format(FORMAT_DATE_TIME);
          this.setState({
            startDate,
            endDate,
            isLoading: false,
          });
          this.isUpdateEndDate = true;
        }
      } catch (e) {
        this.setState({ isLoading: false });
      }
    });
  }

  onError(error) {
    try {
      ApiErrorUtils.handleHttpError(error, Alert.instance, () => { });
    } catch (err) {
      // do something
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  onChangeDate(date, value) {
    const valueFormat = dayjs(value).format(FORMAT_DATE_TIME);
    this.setState({
      [date]: valueFormat,
    }, () => {
      this.fetchChartData();
      this.fetchPayOffHistory();
    });
  }

  onChangeSelectDropDown(optionId, option) {
    // const { idsSelected } = this.state;
    // const arrayId = [...idsSelected];
    // if (arrayId.indexOf(optionId) === -1) {
    //   arrayId.push(optionId);
    // } else {
    //   arrayId.splice(arrayId.indexOf(optionId), 1);
    // }
    this.setState({
      idsSelected: option.id,
    }, () => {
      this.fetchChartData();
      this.fetchPayOffHistory();
    });
  }

  fetchChartData() {
    const { startDate, endDate, idsSelected } = this.state;
    this.setState({ isLoading: true });
    const params = {
      botId: idsSelected,
      startDate,
      endDate,
    };
    // this.props.fetchDataCharts(
    //   idsSelected, startDate, endDate, this.onSuccess, this.onError,
    // );
    // fetch data pay off - data for chart
    this.props.fetchBotHistory(params, this.onSuccessChartData, this.onError);
  }

  fetchPayOffHistory() {
    const { startDate, endDate } = this.state;
    const { idsSelected } = this.state;
    this.setState({ isLoading: true });
    const params = {
      idsSelected: [idsSelected],
      startDate,
      endDate,
    };
    this.props.fetchPayOffHistory(
      params, this.onSuccess, this.onError,
    );
  }


  render() {
    const { chartData, payOffsData, listBots } = this.props;
    const {
      startDate, endDate, isLoading, idsSelected,
    } = this.state;
    let maxLength = 0;
    const elementDocument = document.createElement('canvas');
    const context = elementDocument.getContext('2d');
    context.font = '18px Arial';
    const dropdownData = [{
      id: -1,
      text: i18n.t('total'),
      value: -1,
    }];
    listBots.map((item) => {
      const botName = item.deleted_at ? item.id + i18n.t('botNameDeleted') : item.name;
      const bot = {
        id: item.id,
        text: botName,
        value: item.id,
      };
      const text = context.measureText(botName);
      if (text.width > maxLength) {
        maxLength = text.width;
      }
      dropdownData.push(bot);
      return true;
    });
    const dataPayOff = [...payOffsData].reverse();
    let gc = chartData.data ? chartData.data.map(item => Number(item.payoff)) : [];
    let labels = chartData.data ? chartData.data.map(item => item.date) : [];
    labels = [...labels].reverse();
    gc = [...gc].reverse();
    let total = 0;
    gc.map((item) => {
      total += item;
      return true;
    });
    return (
      <ContentContainer>
        <ContentHeader>
          <SpanTotal>
            {`${i18n.t('revenueTotalGC')}: `} {
              <SpanTotal color={total < 0 ? '#ff5a5a' : '#2d889c'}>
                <StyleNumber value={total} afterDot={2} color={total < 0 ? '#ff5a5a' : '#2d889c'} /> GC
              </SpanTotal>
              }
          </SpanTotal>
          {Object.keys(dropdownData).length > 0
            && (
              <WrapperDropDown>
                {/* <DropdownMultiSelect
                  data={listBot}
                  listSelectedKeyId={idsSelected}
                  onChangeSelected={this.onChangeSelectDropDown}
                /> */}
                <DropDown
                  data={dropdownData}
                  width={maxLength / 18 + 4}
                  heightOptions={10}
                  onChangeSelected={this.onChangeSelectDropDown}
                />
              </WrapperDropDown>
            )}
        </ContentHeader>
        <MedianStrip />
        <BodyContent>
          <RevenueChart
            gc={gc}
            labels={labels}
            startDate={startDate}
            endDate={endDate}
            onChangeDate={this.onChangeDate}
            updateAt={chartData.updated_at}
          />
        </BodyContent>
        <RevenueHistoryTable
          dataPayOff={dataPayOff}
          idsSelected={idsSelected}
        />
        <Spinner isLoading={isLoading} />
      </ContentContainer>
    );
  }
}

Revenue.defaultProps = {
  chartData: {},
  payOffsData: [],
  listBots: [],
};

Revenue.propTypes = {
  chartData: PropTypes.any,
  payOffsData: PropTypes.any,
  fetchListBot: PropTypes.func.isRequired,
  // fetchDataCharts: PropTypes.func.isRequired,
  fetchPayOffHistory: PropTypes.func.isRequired,
  fetchBotHistory: PropTypes.func.isRequired,
  listBots: PropTypes.any,
};

export default Revenue;
