import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';
import {
  DatePickerCustom, WrapperDatePicker, SpanRed, WrapperChart,
  TitleChart, Icon, Blank, Text,
} from './RevenueStyle';
import { convertToLocalTime, FORMAT_DATE_TIME } from '../../constants/Constants';
import i18n from '../../i18n/i18n';
import images from '../../../assets/images';

const color = 'rgba(200, 200, 200, 0.7)';

const WrapperDate = styled.div`
  display: flex;
  align-items: center;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.8em;
  margin-left: 1em;
  position: absolute;
`;

export const colorColumn = '#54cdff';
export const colorLine = '#fff'; // '#54cdff'; // The main line color
export const colorLineZero = '#09f51c';

export const convertLabels = (labels) => {
  const dates = [];
  for (let i = 0; i < labels.length; i += 1) {
    const date = dayjs(labels[i]).format('MM/DD');
    dates.push(date);
  }
  return dates;
};

export const getColumnColor = (context) => {
  const index = context.dataIndex;
  const value = context.dataset.data[index];
  return value >= 0 ? colorColumn : '#e23939';
};

export const convertDayjsToDate = (dayjsText) => {
  const d = new Date();
  const d0 = dayjs(dayjsText);
  d.setDate(d0.date());
  d.setMonth(d0.month());
  d.setFullYear(d0.year());
  d.setHours(d0.hour());
  d.setMinutes(d0.minute());
  d.setSeconds(d0.second());
  return d;
};

class RevenueChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: {
        startDate: true,
        endDate: true,
      },
    };

    this.handleChangeDate = this.handleChangeDate.bind(this);
  }

  handleChangeDate(fieldName, value) {
    const { onChangeDate } = this.props;
    const { isValid } = this.state;
    if (value === null) {
      this.state({ isValid: { [fieldName]: true } });
    } else {
      if (!isValid) {
        this.state({ isValid: { [fieldName]: false } });
      }
      onChangeDate(fieldName, value);
    }
  }

  render() {
    const {
      startDate, endDate, minDate, gc, labels, updateAt,
    } = this.props;
    const { isValid } = this.state;
    const updatedDate = convertToLocalTime(updateAt);
    const listSum = [];
    let sum = 0;
    if (gc.length > 0) {
      listSum.push(gc[0]);
      sum += gc[0];
    }
    for (let i = 1; i < gc.length; i += 1) {
      sum += gc[i];
      listSum.push(sum);
    }

    const data = [
      {
        label: i18n.t('revenueChart.total'),
        fill: false,
        lineTension: 0.1,
        borderColor: colorLine,
        pointBorderWidth: 1,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: colorLine,
        pointHoverBorderColor: '#00647a',
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: colorLine,
        pointBorderColor: colorLine,
        pointStyle: 'rect',
        data: listSum,
      },
      {
        label: i18n.t('revenueChart.daily'),
        data: gc,
        backgroundColor: getColumnColor, // colorColumn,
        // borderWidth: 1,
        // borderColor: '#fff',
        // borderSkipped: false,
        type: 'bar',
        barPercentage: 0.6,
      },
    ];
    const option = {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: color,
            // min: 0,
            // stepSize: 1,
            // fontSize: 14,
          },
          scaleLabel: {
            display: true,
            fontSize: 50,
          },
          gridLines: {
            color,
            lineWidth: 1,
            zeroLineColor: colorLineZero,
            zeroLineWidth: 2,
          },
        }],
        xAxes: [{
          ticks: {
            fontColor: color,
            fontSize: 14,
          },
          gridLines: {
            color,
            lineWidth: 1,
          },
        }],
      },
    };
    const timeZoneFull = moment().format('Z');
    const timeZone = timeZoneFull[1] === '0'
      ? timeZoneFull[0] + timeZoneFull[2]
      : timeZoneFull[0] + timeZoneFull[1] + timeZoneFull[2];
    return (
      <WrapperChart>
        <WrapperDatePicker isMobile={isMobile}>
          <div>
            <WrapperDate>
              <span>{i18n.t('dateRange')}(UTC)</span>
              <div>
                <DatePickerCustom
                  selected={convertDayjsToDate(startDate)}
                  dateFormat="yyyy-MM-dd"
                  onChange={value => this.handleChangeDate('startDate', value)}
                  minDate={convertDayjsToDate(minDate)}
                  maxDate={convertDayjsToDate(endDate)}
                />
                {!isValid.startDate && <ErrorText>{i18n.t('fieldRequired')}</ErrorText>}
              </div>
              ~
              <div>
                <DatePickerCustom
                  selected={convertDayjsToDate(endDate)}
                  dateFormat="yyyy-MM-dd"
                  onChange={value => this.handleChangeDate('endDate', value)}
                  minDate={convertDayjsToDate(startDate)}
                  maxDate={convertDayjsToDate(dayjs.utc().format(FORMAT_DATE_TIME))}
                />
                {!isValid.endDate && <ErrorText>{i18n.t('fieldRequired')}</ErrorText>}
              </div>
            </WrapperDate>
            <SpanRed marginTop={0.3}>
              <span>{i18n.t('revenueTimeShow')}</span>
            </SpanRed>
          </div>
          <div>
            <SpanRed marginTop={1}>{i18n.t('lastTimeUpdated')}</SpanRed>
            <SpanRed isMobile={isMobile} marginLeft={1}>
              <span>{i18n.t('UTC')}</span>
              <span>: {dayjs(updateAt).format(FORMAT_DATE_TIME)}</span>
            </SpanRed>
            <SpanRed isMobile={isMobile} marginLeft={1}>
              <span>{i18n.t('utcCurrent', { timeZone })}</span> <span>: {updatedDate}</span>
            </SpanRed>
          </div>
        </WrapperDatePicker>
        <TitleChart>
          <Icon src={images.iconLine} alt="" />
          <Text left={0.2}>{i18n.t('revenueChart.total')}</Text>
          <Blank width={1} />
          <Icon src={images.iconColumn} alt="" />
          <Text>{i18n.t('revenueChart.daily')}</Text>
        </TitleChart>
        <div>
          <Line
            height={95}
            data={{
              labels: convertLabels(labels),
              datasets: data,
            }}
            options={option}
          />
        </div>
      </WrapperChart>
    );
  }
}

RevenueChart.defaultProps = {
  updateAt: '',
};

RevenueChart.propTypes = {
  gc: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  minDate: PropTypes.string.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  updateAt: PropTypes.string,
};

export default RevenueChart;
