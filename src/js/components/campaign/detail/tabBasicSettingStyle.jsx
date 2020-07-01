import React from 'react';
import styled from 'styled-components';
// import colors from '../../../theme/colors';
import { element } from 'prop-types';
import images from '../../../../assets/images';
import i18n from '../../../i18n/i18n';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex: ${props => props.flex};
  align-items: center;
`;

export const Wrapper = styled(Row)`
  width: 100%;
  border-bottom: 1px solid #808080ab;
  align-items: ${props => !props.isMobile && 'flex-start'};
  display: ${props => props.isMobile && 'block'};
  flex: 1;
`;

export const TitleGroup = styled.span`
  margin-left: 1em;
  font-size: 1em;
  font-weight: bold;
  width: ${props => (props.width ? `${props.width}em` : 'unset')};
`;

export const TitleField = styled.div`
  margin-left: 2em;
  width: ${props => (props.width ? `${props.width}em` : 'unset')};
`;

export const Blank = styled.div`
  height: ${props => props.height}em;
  width: ${props => props.width}em;
`;

export const Line = styled.div`
  background-color: #808080ab;
  height: 1px;
  width: 100%;
`;

export const InputCheckBox = styled.input`
  margin-left: 1em;
`;

export const HelpWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #cfdff50f;
  flex: 1;
  overflow: auto;
  height: ${props => (props.isMobile ? '20em' : '30em')};
  margin: 1em;
  padding-top: 0.5em;
  border: 1px solid gray;
  border-radius: 0.5em;
  width: ${props => (props.isMobile ? 'unset' : '60%')};
`;

export const IconHelp = styled.img`
  width: 1em;
  margin-left: 0.5em;
  cursor: pointer;
`;

export const renderButtonHelp = (key, selectedKey, onClick) => {
  const source = key === selectedKey ? images.iconHelpSelected : images.iconHelpNormal;
  return (<IconHelp src={source} alt="" onClick={onClick} />);
};

export const renderHelp = (currentHelpKey, isMobile) => {
  const content = currentHelpKey || '';
  return (
    <HelpWrapper isMobile={isMobile}>
      <Row>
        <TitleGroup>{i18n.t('help')}:</TitleGroup>
        <Blank width={1} />
        <span>{i18n.t(content)}</span>
      </Row>
    </HelpWrapper>
  );
};

export const searchDescription = (id, listOptions) => {
  let descriptionSelect = '';
  listOptions.map((item) => {
    if (item.id === id) descriptionSelect = item.description;
    return true;
  });
  return descriptionSelect;
};

export const FieldContent = styled.div`
  padding: 0 2em 1em 1em;
  white-space: pre-wrap;
  line-height: 1.2em;
`;

export const PointRateNote = styled.div`
  margin-left: 2em;
  width: ${props => (props.width ? `${props.width}em` : 'unset')};
  color: #e07418;
`;
