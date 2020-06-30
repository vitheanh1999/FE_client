import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { LineChartOptions } from '../dashboard/Main';
import { StyledChartArea } from './BotDetailStyle';

class ChartRevenueHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      revenueHistory, labels, fontSize,
      width, height, title,
    } = this.props;
    return (
      <StyledChartArea width={width}>
        <Line
          responsive={false}
          height={height}
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
          options={LineChartOptions(title, fontSize && fontSize)}
        />
      </StyledChartArea>
    );
  }
}


ChartRevenueHistory.propTypes = {
  revenueHistory: PropTypes.array,
  labels: PropTypes.array,
  width: PropTypes.string.isRequired,
  height: PropTypes.number,
  title: PropTypes.string,
  fontSize: PropTypes.number,
};

ChartRevenueHistory.defaultProps = {
  revenueHistory: [],
  labels: [],
  height: 80,
  title: '',
  fontSize: 0,
};

export default ChartRevenueHistory;
