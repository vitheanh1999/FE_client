import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import moment from 'moment';
import Dropdown from '../common/Dropdown/Dropdown';
import { LineChartOptions } from '../dashboard/Main';
import i18n from '../../i18n/i18n';
import { getMinDate } from '../../constants/Constants';
import {
  Label, StyledDatePicker, GcText, Title, ChartArea, ChartTitle, Wrapper, Notification,
} from './RevenueMobileStyled';


class RevenueMobile extends Component {
  componentDidMount() { }

  renderTitle() {
    const {
      onChangeSelectBots, listBots, date, handleChangeDate,
    } = this.props;
    const listBotsClone = listBots.map((item) => {
      const result = { ...item };
      result.text = item.dbac_code;
      return result;
    });
    listBotsClone.unshift({ id: -1, text: 'Total' });
    const gc = this.props.revenueHistory
      && this.props.revenueHistory[this.props.revenueHistory.length - 1];
    return (
      <div>
        <Title>
          <span>{i18n.t('revenue')}:</span><GcText isRed={gc < 0}>{gc && gc.toLocaleString('ja')}</GcText>
        </Title>
        <ChartTitle>
          <div>
            <Label>{i18n.t('dateRange')}: </Label>
            <div>
              <StyledDatePicker
                selected={new Date(date.startDate)}
                dateFormat="yyyy-MM-dd"
                onChange={value => handleChangeDate('startDate', value)}
                maxDate={new Date(date.endDate)}
                minDate={new Date(getMinDate())}
              />
              ~
              <StyledDatePicker
                selected={new Date(date.endDate)}
                dateFormat="yyyy-MM-dd"
                onChange={value => handleChangeDate('endDate', value)}
                minDate={new Date(date.startDate)}
                maxDate={new Date()}
              />
            </div>
          </div>
          <Dropdown
            onChangeSelected={onChangeSelectBots}
            data={listBotsClone}
            width={7}
          />
        </ChartTitle>
      </div>
    );
  }

  renderRevenue() {
    const { labels, revenueHistory, lastestUpdateAt } = this.props;
    const tz = new Date().getTimezoneOffset();

    return (
      <div>
        <Notification>
          *{i18n.t('lastTimeUpdated')}: {moment(lastestUpdateAt).add(-tz, 'm').format('YYYY-MM-DD HH:mm:ss')}
        </Notification>
        <ChartArea>
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: 'GC',
                  borderColor: revenueHistory && revenueHistory[revenueHistory.length - 1] >= 0 ? '#2fa2e9' : 'red',
                  backgroundColor: 'transparent',
                  pointBackgroundColor: revenueHistory && revenueHistory[revenueHistory.length - 1] >= 0 ? '#2fa2e9' : 'red',
                  data: revenueHistory,
                },
              ],
            }}
            options={LineChartOptions}
          />
        </ChartArea>
      </div>
    );
  }

  render() {
    return (
      <Wrapper>
        {this.renderTitle()}
        {this.renderRevenue()}
      </Wrapper>
    );
  }
}

RevenueMobile.defaultProps = {
  labels: [],
  revenueHistory: [],
  listBots: [],
  lastestUpdateAt: '',
  date: {},
  handleChangeDate: () => { },
};

RevenueMobile.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.any),
  revenueHistory: PropTypes.arrayOf(PropTypes.any),
  listBots: PropTypes.arrayOf(PropTypes.any),
  onChangeSelectBots: PropTypes.func.isRequired,
  lastestUpdateAt: PropTypes.string,
  date: PropTypes.object,
  handleChangeDate: PropTypes.func,
};
export default RevenueMobile;
