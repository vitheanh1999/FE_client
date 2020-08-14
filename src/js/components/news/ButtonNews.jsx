import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import images from '../../../assets/images';

const Wrapper = styled.div`
  background-image: url(${images.iconNotify});
  width: ${props => props.width}em;
  height: ${props => props.width * 1.196}em;
  background-size: contain;
  cursor: pointer;

  &: hover {
    filter: opacity(75%);
  }
`;

const Round = styled.div`
  min-width: 1.4em;
  height: 1.4em;
  background-color: #3095cb;
  border-radius: 2.5em;
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding-left: 0.15em;
  padding-right: 0.15em;
`;


class ButtonNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // isShowAll: false,
    };
  }

  componentDidMount() {

  }

  render() {
    const { width, countNew, onClick } = this.props;
    const isShow = typeof (countNew) === 'string' || (
      typeof (countNew) === 'number' && countNew > 0
    );
    return (
      <Wrapper width={width} onClick={onClick}>
        {
          isShow && (
            <Round>
              {countNew}
            </Round>
          )
        }
      </Wrapper>
    );
  }
}

ButtonNews.propTypes = {
  countNew: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.number,
  onClick: PropTypes.func,
};

ButtonNews.defaultProps = {
  countNew: 0,
  width: 2,
  onClick: () => { },
};

export default ButtonNews;
