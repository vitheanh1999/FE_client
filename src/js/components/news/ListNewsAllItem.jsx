import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #222;
  width: 94%;
  border-radius: 0.5em;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0.5em;
  margin-bottom: 0.5em;

  &:hover {
    background-color: #555555;
  }
`;

const Title = styled.div`
  width: 100%;
  font-size: 1em;
  font-weight: 700;
  display: flex;
  justify-content:  flex-start;
  align-items: flex-start;
  color: white;
`;

const Content = styled.div`
  width: 100%;
  font-size: 0.85em;
  font-weight: 200;
  display: flex;
  justify-content:  flex-start;
  align-items: flex-start;
  color: white;
`;

class ListNewsAllItem extends PureComponent {
  componentWillMount() {
  }

  componentDidMount() {
  }

  onClickNotifyButton() {
    const { isShowAll } = this.state;
    this.setState({ isShowAll: !isShowAll });
  }

  render() {
    const { title, shortContent } = this.props;
    return (
      <Wrapper>
        <Title>{title}</Title>
        <Content>{shortContent}</Content>
      </Wrapper>
    );
  }
}

ListNewsAllItem.propTypes = {
  title: PropTypes.string,
  shortContent: PropTypes.string,
};

ListNewsAllItem.defaultProps = {
  title: 'title',
  shortContent: 'shortContent',
};

export default ListNewsAllItem;
