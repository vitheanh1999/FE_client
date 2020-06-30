import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 10px;
  flex: 1;
`;

const Title = styled.p`
  color: #fff;
`;

const Image = styled.img`
  opacity: 0.6;
  cursor: pointer;
  height: 3vh;
  &: hover {
    opacity: 1;
  }
`;

class MenuItemMb extends Component {
  componentDidMount() { }

  render() {
    const {
      image, title, onClick,
    } = this.props;
    return (
      <Wrapper>
        <Image src={image} onClick={onClick} />
        <Title>{title}</Title>
      </Wrapper>
    );
  }
}

MenuItemMb.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};

MenuItemMb.defaultProps = {
  image: null,
  title: null,
  onClick: null,
};

export default MenuItemMb;
