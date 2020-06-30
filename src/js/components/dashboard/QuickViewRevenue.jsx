import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import dayjs from 'dayjs';
import {
  ContentHeader, MedianStrip, SpanTotal,
} from '../common/CommonStyle';
import {
  TitleChart, Icon, Blank, Text,
} from '../revenue/RevenueStyle';
import {
  convertLabels, getColumnColor, colorLine,
} from '../revenue/RevenueChart';
import {
  BodyContent, Img,
  Wrapper, SpanRed,
  ContentContainer, WrapperTimeUpdate,
} from './DashBoardStyle';
import images from '../../theme/images';
import imageIcons from '../../../assets/images';
import i18n from '../../i18n/i18n';
import { TAB, convertToLocalTime, FORMAT_DATE_TIME } from '../../constants/Constants';
import StyleNumber from '../StyleNumber';

const colorLineZero = '#09f51c';
const color = 'rgba(200, 200, 200, 0.7)';
class QuickViewRevenue extends Component {
  componentDidMount() { }

  render() {
    const { handleChangeTab, chartData } = this.props;
    let labels = chartData.data ? chartData.data.map(item => item.date) : [];
    let gc = chartData.data ? chartData.data.map(item => Number(item.payoff)) : [];
    labels = [...labels].reverse();
    gc = [...gc].reverse();
    let total = 0;
    gc.map((item) => {
      total += item;
      return true;
    });

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

    const updatedDate = convertToLocalTime(chartData.updated_at);
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
        backgroundColor: getColumnColor,
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
      <ContentContainer>
        <ContentHeader>
          <SpanTotal>
            {`${i18n.t('revenueTotalGC')}: `} {
              <SpanTotal color={total < 0 ? '#ff5a5a' : '#2d889c'}>
                <StyleNumber value={total} afterDot={2} color={total < 0 ? '#ff5a5a' : '#2d889c'} /> GC
              </SpanTotal>
            }
          </SpanTotal>
          <Img src={images.btnDetail} onClick={() => handleChangeTab(TAB.REVENUE)} />
        </ContentHeader>
        <MedianStrip />
        <BodyContent>
          <Wrapper backgroundColor="#333">
            <WrapperTimeUpdate>
              <div>
                <SpanRed size={0.8}>{i18n.t('lastTimeUpdated')}</SpanRed>
                <SpanRed marginLeft={1} size={0.8}>
                  <span>{i18n.t('UTC')}</span>
                  <span>: {dayjs(chartData.updated_at).format(FORMAT_DATE_TIME)}</span>
                </SpanRed>
                <SpanRed marginLeft={1} size={0.8}>
                  <span>{i18n.t('utcCurrent', { timeZone })}</span> <span>: {updatedDate}</span>
                </SpanRed>
              </div>
            </WrapperTimeUpdate>
            <TitleChart>
              <Icon src={imageIcons.iconLine} alt="" />
              <Text left={0.2}>{i18n.t('revenueChart.total')}</Text>
              <Blank width={1} />
              <Icon src={imageIcons.iconColumn} alt="" />
              <Text>{i18n.t('revenueChart.daily')}</Text>
            </TitleChart>
            <Line
              height={190}
              data={{
                labels: convertLabels(labels),
                datasets: data,
              }}
              options={option}
            />
          </Wrapper>
        </BodyContent>
      </ContentContainer>
    );
  }
}

QuickViewRevenue.defaultProps = {
  chartData: {},
};

QuickViewRevenue.propTypes = {
  handleChangeTab: PropTypes.func.isRequired,
  chartData: PropTypes.any,
};

export default QuickViewRevenue;
