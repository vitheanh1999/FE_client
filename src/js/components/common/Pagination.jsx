import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import color from '../../theme/colors';

let colorDefault = color.myPageColorDefault;
let colorSelect = color.myPageColorSelect;

const Page = styled.div`
  height: ${props => props.scale * 20}px;
  display: flex;
  align-items: center;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: ${props => props.scale * 20}px;
`;

const PageWrap = styled.div`
  display: flex;
  align-items: center;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
`;

const TextPage = styled.div`
  height: ${props => props.scale * 20}px;
  line-height: ${props => props.scale * 15}px;
  width: ${props => props.scale * 20}px;
  font-size: ${props => props.scale * 12}px;
  text-align: center;

  &: hover {
    border-left: 2px solid ${props => props.borderColor.border};
    border-right: 2px solid ${props => props.borderColor.border};
    border-bottom: 2px solid ${props => props.borderColor.border};
    border-top: 2px solid ${props => props.borderColor.border};
    background: ${props => props.borderColor.select};
    color: ${props => props.borderColor.textColorHover};
  }
  background: ${props => props.borderColor.unSelect};
  color: ${props => props.borderColor.textColor};
  margin: ${props => props.scale * 3}px;
  border-radius: 50%;
  border-left: 2px solid ${props => props.borderColor.borderSelect};
  border-right: 2px solid ${props => props.borderColor.borderSelect};
  border-bottom: 2px solid ${props => props.borderColor.borderSelect};
  border-top: 2px solid ${props => props.borderColor.borderSelect};
  cursor: pointer;
`;

const TextDot = styled.div`
  color: ${props => props.borderColor.textColor};
  line-height: ${props => props.scale * 15}px;
  width: ${props => props.scale * 20}px;
  font-size: ${props => props.scale * 12}px;
  text-align: center;
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-bottom: 2px solid transparent;
  border-top: 2px solid transparent;
  margin: ${props => props.scale * 3}px;
  border-radius: 50%;
  cursor: pointer;
`;

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.linePage = this.linePage.bind(this);
    this.itemPage = this.itemPage.bind(this);
    this.ClickPage = this.ClickPage.bind(this);
    this.ClickChangePage = this.ClickChangePage.bind(this);
  }

  componentDidMount() {
    const { type } = this.props;
    if (type === 'myPage') {
      colorDefault = color.myPageColorDefault;
      colorSelect = color.myPageColorSelect;
    } else {
      colorDefault = color.historyBettingColorDefault;
      colorSelect = color.historyBettingColorSelect;
    }
  }

  linePage() {
    const { sum, currentPage, scale } = this.props;
    const list = [];
    if (sum <= 5) {
      for (let i = 1; i <= sum; i += 1) {
        list.push(this.itemPage(i));
      }
      return list;
    }
    //-----------------------------
    let page = 1;
    if (currentPage >= sum - 5) {
      page = sum - 5;
      for (let i = page; i <= sum; i += 1) {
        list.push(this.itemPage(i));
      }
      return list;
    }
    //-----------------------------
    if (currentPage > 3 && currentPage < sum - 2) {
      page = currentPage - 2;
    } else if (currentPage >= sum - 2) {
      page = sum - 4;
    } else {
      page = 1;
    }

    let finishPage = 2;
    for (let i = page; i < page + 7; i += 1) {
      if (i === page + 4) {
        list.push(<TextDot scale={scale} key={i} width="30px" borderColor={colorDefault} onClick={() => this.ClickPage(i)}>...</TextDot>);
      } else if (i > page + 4) {
        finishPage -= 1;
        list.push(this.itemPage(sum - finishPage));
      } else {
        list.push(this.itemPage(i));
      }
    }
    return list;
  }

  itemPage(i) {
    const { currentPage, scale } = this.props;
    return (
      <TextPage scale={scale} key={i} width="30px" borderColor={currentPage === i ? colorSelect : colorDefault} onClick={() => this.ClickPage(i)}>{i}</TextPage>
    );
  }

  ClickPage(i) {
    const { onChange, currentPage } = this.props;
    if (currentPage !== i) {
      onChange(i);
    }
  }

  ClickChangePage(event) {
    const nextPage = event ? -1 : 1;
    const { currentPage, sum } = this.props;
    const newPos = currentPage + nextPage;
    if (newPos >= 1 && newPos <= sum) {
      this.ClickPage(newPos);
    }
  }

  renderPageWrap(key) {
    const {
      sum,
      currentPage,
      scale,
    } = this.props;
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

  render() {
    const {
      sum,
      customStyle,
      scale,
    } = this.props;
    const listPage = sum > 0 ? this.linePage() : [];

    return (
      <Page scale={scale} style={{ ...customStyle }}>
        <PageWrap>
          {this.renderPageWrap('firstPage')}
          {this.renderPageWrap('presPage')}
          {listPage}
          {this.renderPageWrap('nextPage')}
          {this.renderPageWrap('lastPage')}
        </PageWrap>
      </Page>
    );
  }
}

Pagination.propTypes = {
  onChange: PropTypes.func.isRequired,
  sum: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  type: PropTypes.string,
  customStyle: PropTypes.objectOf(PropTypes.any),
  scale: PropTypes.number,
};

Pagination.defaultProps = {
  type: null,
  customStyle: {},
  scale: 1,
};

export default Pagination;
