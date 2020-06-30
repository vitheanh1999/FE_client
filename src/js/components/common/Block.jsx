import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 0.25em;
  margin-top: ${props => props.top}px;
  margin-bottom: ${props => props.bottom}px;
`;

const Title = styled.div`
  width: 100%;
  min-height: 2.75em;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 1em;
  font-weight: bold;
  font-size: 120%;
`;

const GrayLine = styled.div`
  width: 100%;
  height: 0.3em;
  background-color: #ccc;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 1em;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() { }

  render() {
    const {
      title, content, top, bottom, onClickTitle,
      isMinimum, contentStyle,
    } = this.props;
    return (
      <Wrapper top={top} bottom={bottom}>
        <Title onClick={() => { if (onClickTitle) onClickTitle(); }}>
          {title}
        </Title>
        {
          !isMinimum && this.props.hasGrayLine && <GrayLine />
        }
        {
          !isMinimum && (
            <Content style={contentStyle}>
              {content}
            </Content>
          )
        }
      </Wrapper>
    );
  }
}


Block.propTypes = {
  title: PropTypes.any.isRequired,
  content: PropTypes.any.isRequired,
  top: PropTypes.number,
  bottom: PropTypes.number,
  isMinimum: PropTypes.bool,
  onClickTitle: PropTypes.func,
  hasGrayLine: PropTypes.bool,
  contentStyle: PropTypes.objectOf(PropTypes.any),
};

Block.defaultProps = {
  top: 0,
  bottom: 0,
  onClickTitle: null,
  isMinimum: false,
  hasGrayLine: true,
  contentStyle: {},
};

export default Block;
