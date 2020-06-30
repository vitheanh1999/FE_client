import React from 'react';
import styled from 'styled-components';
import i18n from '../../../i18n/i18n';

const Input = styled.input`
  height: 0;
  width: 0;
  visibility: hidden;

  :checked + .react-switch-label .react-switch-button {
    left: calc(100% - ${props => props.scale * 2}px);
    transform: translateX(-100%);
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: ${props => props.scale * 60}px;
  height: ${props => props.scale * 19}px;
  background: ${props => (props.isOn ? '#DCDCDC' : '#186F00')};
  border-radius: ${props => props.scale * 100}px;
  position: relative;
  transition: background-color .2s;
  margin-bottom: 0;

  & > div {
    color: ${props => (props.isOn ? 'green' : '#fff')};
    margin-left: ${props => !props.isOn && props.scale * 18}px;
    font-size: ${props => props.scale * 10}px;
    font-weight: 700;
    text-align: center;
    width: 70%;
  }
`;

const Button = styled.span`
  position: absolute;
  top: ${props => props.scale * 2}px;
  left: ${props => props.scale * 2}px;
  width: ${props => props.scale * 16}px;
  height: ${props => props.scale * 16}px;
  border-radius: ${props => props.scale * 12}px;
  transition: 0.2s;
  background: ${props => (props.isOn ? 'green' : '#fff')};
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Switch = ({ isOn, handleToggle, scale }) => (
  <>
    <Input
      checked={isOn}
      onChange={handleToggle}
      className="react-switch-checkbox"
      id="react-switch-new"
      type="checkbox"
      scale={scale}
    />
    <Label
      className="react-switch-label"
      htmlFor="react-switch-new"
      scale={scale}
      isOn={isOn}
    >
      <div
        className="react-switch-text"
        scale={scale}
      >
        {isOn ? i18n.t('on') : i18n.t('off')}
      </div>
      <Button className="react-switch-button" scale={scale} isOn={isOn} />
    </Label>
  </>
);

export default Switch;
