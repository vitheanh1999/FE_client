import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { images } from '../../theme';
import i18n from '../../i18n/i18n';

const MaintainAlertStyle = styled.div`
  display: flex;
`;

const IconClock = styled.img`
  margin-right: 0.5em;
  height: 3em;
  width: 3em;
`;

const Container = styled.div`
  color: #fff;
  font-size: 0.8em;
  padding-left: 1em;
`;

const TimeCountText = styled.span`
  color: ${props => props.color || '#fff'};
`;

const DivCenter = styled.div`
  display: flex;
  align-items: center;
  white-space: pre;
`;

const getNumber = (number, minLen) => {
  const str = number.toString();
  if (str.length >= minLen) return str;
  const diff = minLen - str.length;
  let pre = '';
  for (let i = 0; i < diff; i += 1) {
    pre += '0';
  }
  return pre + str;
};

const getTimeText = (day, hour, minute) => {
  const h = day * 24 + hour;
  return `${getNumber(h, 2)}:${getNumber(minute, 2)}`;
};

class MaintainNotification extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
  }

  componentDidMount() {
    this.interval = setInterval(() => this.onInterval(), 3000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onInterval() {
    this.setState({});
  }

  render() {
    const { maintainInfo } = this.props;
    if (maintainInfo.show === 0) return null;
    const now = moment();
    let startPlan = moment();
    if (maintainInfo && Object.keys(maintainInfo).length !== 0) {
      startPlan = moment(maintainInfo.start_plan);
    }
    const startPlanLocal = startPlan.add(moment().utcOffset(), 'minutes');
    const timeDiff = startPlanLocal.diff(now);
    if (timeDiff <= 0) {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
    const minute = moment.duration(timeDiff, 'milliseconds').minutes();
    const hour = moment.duration(timeDiff, 'milliseconds').hours();
    const day = moment.duration(timeDiff, 'milliseconds').days();
    const maintainText = this.interval ? i18n.t('maintainAfter') : '';
    const timeCountColor = hour < 1 ? 'red' : 'white';
    return (
      timeDiff > 0 && maintainInfo && Object.keys(maintainInfo).length !== 0
        ? (
          <Container>
            <MaintainAlertStyle>
              <IconClock src={images.iconClock2} width="19%" />
              <DivCenter>
                <span>{maintainText}</span>
                <TimeCountText color={timeCountColor}>
                  {getTimeText(day, hour, minute)}
                </TimeCountText>
              </DivCenter>
            </MaintainAlertStyle>
            <span>{i18n.t('nextMaintenance')}</span>
            <span>{startPlanLocal.format('YYYY/MM/DD HH:mm')}</span>
          </Container>
        ) : null
    );
  }
}

MaintainNotification.defaultProps = {
};
MaintainNotification.propTypes = {
  maintainInfo: PropTypes.object.isRequired,
};

export default MaintainNotification;
