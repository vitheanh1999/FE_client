import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { convertNumber } from '../Utils';

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  margin-left: ${props => props.scale * 2}px;
  padding: 0 ${props => props.scale * 5}px;
  border-radius: 4px;
`;

const ContentColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled.img`
  width: ${props => props.scale * 15}px;
  height: ${props => props.scale * 15}px;
  margin-left: ${props => props.scale * 2}px;
`;

export const WrapperDot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
`;

const LabelSumCoin = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  width: ${props => props.scale * 80}px;
  max-height: ${props => props.scale * 40}px;
  border-radius: ${props => props.scale * 4}px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: ${props => props.scale * 16}px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  pointer-events: none;
  flex-direction: column;
`;

const LabelSumCoinAbove = styled(LabelSumCoin)`
  width: ${props => props.scale * 162}px;
  background-color: transparent;
  max-height: unset;
  flex-direction: row;
  padding: 0 ${props => props.scale * 3}px;
`;

export default class TableBetLabel extends Component {
  componentDidMount() {

  }

  renderAboveContentText(left, top, type) {
    const { totalBet, tableChipTypes, scale } = this.props;
    return Object.keys(totalBet[type]).length !== 0
      ? (
        <LabelSumCoinAbove left={left} top={top} scale={scale}>
          {Object.keys(totalBet[type]).map((item) => {
            const url = tableChipTypes.find(i => i.id === parseInt(item, 10))
              && tableChipTypes.find(i => i.id === parseInt(item, 10)).icon;
            if (totalBet[type][item] === 0) return <div />;
            return (
              <Content scale={scale}>
                {convertNumber(totalBet[type][item])}
                <Icon src={url} alt="icon" scale={scale} />
              </Content>
            );
          })}
        </LabelSumCoinAbove>
      )
      : <div />;
  }

  renderUnderContentText(left, top, type) {
    const { totalBet, tableChipTypes, scale } = this.props;
    return Object.keys(totalBet[type]).length !== 0
      ? (
        <LabelSumCoin left={left} top={top} scale={scale}>
          {Object.keys(totalBet[type]).map((item, index) => {
            const url = tableChipTypes.find(i => i.id === parseInt(item, 10))
              && tableChipTypes.find(i => i.id === parseInt(item, 10)).icon;
            if (totalBet[type][item] === 0) return <div />;
            const keyId = index;
            return (
              <ContentColumn key={keyId} scale={scale}>
                {convertNumber(totalBet[type][item])}
                <Icon src={url} alt="icon" scale={scale} />
              </ContentColumn>
            );
          })}
        </LabelSumCoin>
      )
      : <div />;
  }

  render() {
    return (
      <WrapperDot>
        {
          this.renderAboveContentText(520, 167, 'betPlayerPair')
        }
        {
          this.renderAboveContentText(696, 167, 'betTie')
        }
        {
          this.renderUnderContentText(874, 269, 'betBanker')
        }
        {
          this.renderUnderContentText(606, 269, 'betPlayer')
        }
        {
          this.renderAboveContentText(872, 167, 'betBankerPair')
        }
      </WrapperDot>
    );
  }
}

TableBetLabel.propTypes = {
  totalBet: PropTypes.objectOf(PropTypes.any).isRequired,
  tableChipTypes: PropTypes.arrayOf(PropTypes.any).isRequired,
  scale: PropTypes.number.isRequired,
};

TableBetLabel.defaultProps = {
};
