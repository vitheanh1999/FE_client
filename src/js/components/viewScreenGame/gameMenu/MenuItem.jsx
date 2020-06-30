import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import Tooltip from 'react-simple-tooltip';

const Wrapper = styled.div`
  margin-left: ${props => (props.isMobile ? '14px' : '8px')};
  margin-right: ${props => (props.isMobile ? '14px' : '8px')};
  line-height: 1;

  &:last-child > div > div {
    left: unset;
    transform: unset;
    right: -10px;

    > div {
      left: unset;
      right: 0;
    }
  }
`;
const Image = styled.img`
  opacity: 0.7;
  cursor: pointer;
  user-select: none;

  &: hover {
    opacity: 1;
  }
`;

class MenuItem extends Component {
  componentDidMount() { }

  render() {
    const {
      image, title, onClick,
    } = this.props;
    const background = 'rgb(85,85,85)';
    return (
      <Wrapper isMobile={isMobile}>
        <Tooltip
          style={{ whiteSpace: 'nowrap' }}
          content={title}
          placement="bottom"
          background={background}
          arrow={10}
          border={background}
          padding={3}
          fontSize="14px"
        >
          <Image src={image} onClick={onClick} />
        </Tooltip>
      </Wrapper>
    );
  }
}

MenuItem.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};

MenuItem.defaultProps = {
  image: null,
  title: null,
  onClick: null,
};

export default MenuItem;
