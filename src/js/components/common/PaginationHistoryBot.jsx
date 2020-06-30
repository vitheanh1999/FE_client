import React from 'react';
import styled from 'styled-components';
import Pagination from './Pagination';
import color from '../../theme/colors';

const colorDefault = color.myPageColorDefault;

const TextPage = styled.div`
  height: ${props => props.scale * 20}px;
  line-height: ${props => props.scale * 15}px;
  width: ${props => props.scale * 20}px;
  font-size: ${props => props.scale * 12}px;
  text-align: center;
  color: ${props => props.borderColor.textHistoryBotColorSelect};
  margin: ${props => props.margin}px;
  cursor: pointer;

  &: hover {
    color: ${props => props.borderColor.textHistoryBotColorHover};
  }
`;

class PaginationHistoryBot extends Pagination {
  itemPage(i) {
    let margin;
    const {
      sum,
      currentPage,
      scale,
    } = this.props;
    if (sum > 999) {
      margin = scale * 5;
    } else {
      margin = scale * 3;
    }

    return (
      <TextPage
        scale={scale}
        margin={margin}
        key={i}
        width="30px"
        borderColor={currentPage === i ? color.myPageColorSelect : colorDefault}
        onClick={() => this.ClickPage(i)}
      >
        {i}
      </TextPage>
    );
  }

  renderPageWrap(key) {
    const { sum, currentPage, scale } = this.props;
    switch (key) {
      case 'nextPage':
        return currentPage < sum
          ? <TextPage scale={scale} width="30px" borderColor={colorDefault} onClick={() => this.ClickChangePage(false)}>{'>'}</TextPage>
          : null;
      case 'presPage':
        return currentPage > 1
          ? <TextPage scale={scale} width="30px" borderColor={colorDefault} onClick={() => this.ClickChangePage(true)}>{'<'}</TextPage>
          : null;
      case 'firstPage':
        return currentPage > 1
          ? <TextPage scale={scale} width="30px" borderColor={colorDefault} onClick={() => this.ClickPage(1)}>{'<<'}</TextPage>
          : null;
      case 'lastPage':
        return currentPage < sum
          ? <TextPage scale={scale} width="30px" borderColor={colorDefault} onClick={() => this.ClickPage(sum)}>{'>>'}</TextPage>
          : null;
      default:
        return null;
    }
  }
}

export default PaginationHistoryBot;
