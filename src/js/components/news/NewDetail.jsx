import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { convertToLocalDateTime } from '../../helpers/utils';
import images from '../../../assets/images';

const Wrapper = styled.div`
  border-radius: 0.5em;
  padding: 1em;
  font-size: ${props => props.fontSize}px;
`;

const Title = styled.div`
  font-size: 2em;
  font-weight: 700;
  word-break: break-word;
  color: white;
`;


const EndPlan = styled.div`
  display: flex;
  justify-content:  flex-end;
  width: 100%;
`;

const ContentData = styled.div`
  margin-top: 1em;
  width: 100%;
`;

const Summry = styled.div`
  display: flex;
  justify-content:  center;
  background-image: url(${images.backgroundNewSummry});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  align-items: center;
  font-weight: 600;
`;

const SummryContent = styled.div`
  width: 80%;
  word-wrap: break-word;
  text-align: center;
`;

const Content = styled.div`
  width: 100%;
  font-size: 0.85em;
  font-weight: 200;
  color: white;
  margin: 2em 0 2em 0;
  word-wrap: break-word;
  white-space: ${props => (props.isOldNew ? 'pre-wrap' : 'unset')};
  line-height: ${props => (props.isOldNew ? 'unset' : '2.6em')};

  >p{
    width: 100%;
  }

  > b, strong {
    font-weight: bold;
  }
`;

const WrapperList = styled.div`
  width: 100%;
`;

const WrapperLink = styled.div`
  >a{
    color: aqua;
  }
`;

const linkify = (text) => {
  if (!text) {
    return '';
  }
  const urlRegex = /(\b[https?|ftp|file]+:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
  const parts = text.split(urlRegex).map((part) => {
    if (part.match(urlRegex)) {
      return <a target="_blank" rel="noopener noreferrer" href={part}>{part}</a>;
    }
    return part;
  });

  return <WrapperLink>{parts}</WrapperLink>;
};

const linkifyContent = (text, isOldNew) => {
  if (!text) {
    return '';
  }
  const dangerDom = <Content id="Contentxxx" isOldNew={isOldNew} dangerouslySetInnerHTML={{ __html: text }} />;
  return <Fragment>{dangerDom}</Fragment>;
};

class NewDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderListContentData() {
    const { newDetail } = this.props;
    const oldNewDate = dayjs('2020-06-11 18:00:00');
    const isOldNew = dayjs(newDetail.created_at).isBefore(oldNewDate);
    const listContentData = newDetail.content_data ? newDetail.content_data.map(item => (
      <ContentData>
        <Summry>
          <SummryContent>
            {linkify(item.summary)}
          </SummryContent>
        </Summry>
        {linkifyContent(item.content, isOldNew)}
      </ContentData>
    )) : [];
    return listContentData;
  }

  render() {
    const { newDetail, fontSize } = this.props;
    const { start_plan: startPlan, title } = newDetail;
    return (
      <Fragment>
        <Wrapper fontSize={fontSize}>
          <EndPlan><span>{convertToLocalDateTime(startPlan, 'YYYY-MM-DD HH:mm')}</span></EndPlan>
          <Title>{linkify(title)}</Title>
          <WrapperList>
            {this.renderListContentData()}
          </WrapperList>
        </Wrapper>
      </Fragment>
    );
  }
}

NewDetail.propTypes = {
  newDetail: PropTypes.object,
  fontSize: PropTypes.number.isRequired,
};

NewDetail.defaultProps = {
  newDetail: {
    id: '',
    title: '',
    content_data: [],
    end_plan: '',
  },
};

export default NewDetail;
