import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Alert from '../../components/common/Alert/Alert';
import { getMinDate, FORMAT_DATE, SORT_BOT_OPTIONS } from '../../constants/Constants';

class SuperRevenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      countSuccess: 0,
      selectedBotId: -1,
      endDate: moment().format(FORMAT_DATE),
      startDate: (getMinDate() < moment().add(-9, 'd').format(FORMAT_DATE))
        ? moment().add(-9, 'd').format(FORMAT_DATE)
        : getMinDate(),
    };

    this.onChangeSelectBots = this.onChangeSelectBots.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    const { selectedBotId, startDate, endDate } = this.state;
    this.setState({ isLoading: true });
    this.props.fetchListBots(SORT_BOT_OPTIONS[2].value, () => { this.onSuccess(); }, () => { this.onSuccess(); });
    this.props.fetchBotHistory(
      selectedBotId, startDate, endDate,
      () => { this.onSuccess(); }, this.onError,
    );
    this.props.fetchChartData(
      selectedBotId, startDate, endDate,
      () => { this.onSuccess(); }, this.onError,
    );
  }

  componentWillUnmount() {
  }

  onChangeSelectBots(botId) {
    const { selectedBotId } = this.state;
    if (selectedBotId !== botId) {
      this.setState({
        selectedBotId: botId,
        isLoading: true,
      });
      const { startDate, endDate } = this.state;
      this.props.fetchBotHistory(botId, startDate, endDate, () => {
        this.onSuccess();
      }, this.onError);
      this.props.fetchChartData(botId, startDate, endDate, () => {
        this.onSuccess();
      }, this.onError);
    }
  }

  onChangeDate(type, value) {
    const { selectedBotId, startDate, endDate } = this.state;
    if (!value) return;
    this.setState({
      isLoading: true,
      [type]: moment(value).format(FORMAT_DATE),
    });
    if (type === 'startDate') {
      this.props.fetchBotHistory(
        selectedBotId, moment(value).format(FORMAT_DATE), endDate, () => {
          this.onSuccess();
        }, () => {
          this.onSuccess();
        },
      );
      this.props.fetchChartData(
        selectedBotId, moment(value).format(FORMAT_DATE), endDate, () => {
          this.onSuccess();
        }, () => {
          this.onSuccess();
        },
      );
    } else {
      this.props.fetchBotHistory(
        selectedBotId, startDate, moment(value).format(FORMAT_DATE), () => {
          this.onSuccess();
        }, () => {
          this.onSuccess();
        },
      );
      this.props.fetchChartData(
        selectedBotId, startDate, moment(value).format(FORMAT_DATE), () => {
          this.onSuccess();
        }, () => {
          this.onSuccess();
        },
      );
    }
  }

  onSuccess() {
    const { countSuccess } = this.state;
    let count = countSuccess;
    count += 1;
    if (count >= 2) {
      this.setState({
        isLoading: false,
        countSuccess: 0,
      });
    }
    this.setState({
      countSuccess: count,
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


  render() {
    return (
      <div
        isLoading={this.state.isLoading}
      />
    );
  }
}

SuperRevenue.defaultProps = {
};

SuperRevenue.propTypes = {
  fetchListBots: PropTypes.func.isRequired,
  fetchBotHistory: PropTypes.func.isRequired,
  fetchChartData: PropTypes.func.isRequired,
};

export default SuperRevenue;
