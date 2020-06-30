import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import i18n from '../../i18n/i18n';

const Wrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.width * 0.457}px;
  border-radius: ${props => props.width * 0.457 * 0.5}px;
  background-color: white;
  border-width: ${props => props.width * 0.03333}px;
  border-style: solid;
  border-color: #2d889c;
  display: flex;
  flex-direction: ${props => (props.active ? 'row-reverse' : 'row')};
  align-items: center;
  color: ${props => (props.active ? '#38c500' : '#2d889c')};
  font-size: ${props => props.width * 0.2444}px;
`;

const Circle = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.width}px;
  background-color: ${props => (props.active ? '#38c500' : '#2d889c')};
  margin-right: ${props => props.width * 0.0625}px;
  margin-left: ${props => props.width * 0.0625}px;
  border-radius: ${props => props.width * 0.5}px;
`;

class Toggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMinimum: true,
    };
  }

  componentDidMount() { }

  onClickTitle() {
    const { isMinimum } = this.state;
    this.setState({ isMinimum: !isMinimum });
  }

  render() {
    const { width, active } = this.props;
    return (
      <Wrapper width={width} active={active}>
        <Circle width={width * 0.35556} active={active} />
        {
          active ? i18n.t('on') : i18n.t('off')
        }
      </Wrapper>
    );
  }
}

Toggle.propTypes = {
  active: PropTypes.bool.isRequired,
  width: PropTypes.number,
};

Toggle.defaultProps = {
  width: 90,
};

export default Toggle;
