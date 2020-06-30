import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { StyledChartArea } from './BotDetailStyle';

class ChartRevenueCampaign extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      labels, width, height,
    } = this.props;
    return (
      <StyledChartArea width={width}>
        <Bar
          height={height}
          data={{
            labels,
            datasets: [{
              label: 'apples',
              data: [12, 19, 3, 17, 28, 24, 7],
            }, {
              label: 'oranges',
              data: [30, 29, 5, 5, 20, 3, 10],
            }],
          }}
        />
      </StyledChartArea>
    );
  }
}


ChartRevenueCampaign.propTypes = {
  labels: PropTypes.array,
  width: PropTypes.string.isRequired,
  height: PropTypes.number,
};

ChartRevenueCampaign.defaultProps = {
  labels: [],
  height: 80,
};

export default ChartRevenueCampaign;
