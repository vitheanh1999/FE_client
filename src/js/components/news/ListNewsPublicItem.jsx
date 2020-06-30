import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { convertToLocalDateTime } from '../../helpers/utils';
import i18n from '../../i18n/i18n';

const Wrapper = styled.div`
  cursor: pointer;
  background-color: #222222;
  width: 100%;
  border-radius: 0.5em;
  padding: 0.5em;
  margin-bottom: 0.5em;

  &:hover {
    background-color: #555555;
  }
`;

const WrapperTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  display: inline-block;
  width: 95%;
  font-size: 1em;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  position: relative;
  padding-right: 0.5em;
`;

const Content = styled.div`
  width: 100%;
  font-size: 0.85em;
  font-weight: 200;
  color: white;
  height: 3em;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Round = styled.i`
  color: aqua;
  font-size: ${props => (props.isOnDashboard ? 1 : 0.7)}em;
  vertical-align: top;
`;

const EndPlan = styled.div`
  display: flex;
  justify-content:  flex-end;
  width: 100%;
`;

class ListNewsPublicItem extends PureComponent {
  componentWillMount() {
  }

  componentDidMount() {
  }

  onClickNotifyButton() {
    const { isShowAll } = this.state;
    this.setState({ isShowAll: !isShowAll });
  }

  render() {
    const { newItem, showModalDetail, isNewPublic } = this.props;
    const {
      title, content_data: contentData,
      start_plan: startPlan,
    } = newItem;
    const isNew = newItem.is_new;
    const summary = contentData[0] ? contentData[0].summary : '';

    return (
      <Wrapper onClick={() => showModalDetail(newItem)}>
        <WrapperTitle>
          <Title>
            {title}
          </Title>
          {
            isNew && (<Round isOnDashboard={!isNewPublic}>{i18n.t('new')}</Round>)
          }
        </WrapperTitle>
        <Content>{summary}</Content>
        {!isNewPublic && (
          <EndPlan><span>{convertToLocalDateTime(startPlan, 'YYYY-MM-DD')}</span></EndPlan>
        )}
      </Wrapper>
    );
  }
}

ListNewsPublicItem.propTypes = {
  newItem: PropTypes.object,
  showModalDetail: PropTypes.func,
  isNewPublic: PropTypes.bool,
};

ListNewsPublicItem.defaultProps = {
  newItem: {
    id: '',
    title: 'title',
    shortContent: 'shortContent',
    content_data: '',
  },
  showModalDetail: () => { },
  isNewPublic: false,
};

export default ListNewsPublicItem;
