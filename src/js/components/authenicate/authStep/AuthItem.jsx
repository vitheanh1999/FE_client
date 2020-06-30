import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import RadioButton from '../../common/RadioButton';
import i18n from '../../../i18n/i18n';

import { Button } from '../authStyle';

// import {
//   BUTTON_ACTION,
//   BUTTON_ACTION_HOVER,
// } from '../../../constants/styleDefaultAuth';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  padding-left: 10px;
  text-transform: uppercase;
  color: white;
  font-size: 1em;
  font-weight: bold;
`;

// const Button = styled(AuthButton)`
//   margin: 0 0 2em 0;
// `;

class AuthItem extends Component {
  componentDidMount() {
  }

  render() {
    const {
      title, onSubmit, checked, onChange,
    } = this.props;

    return (
      <Wrapper>
        <TitleWrapper>
          <RadioButton isChecked={checked} onChange={onChange} />
          <Title>{title}</Title>
        </TitleWrapper>
        {checked && onSubmit
          ? (
            <Button
              width="100%"
              onClick={onSubmit}
            >
              {i18n.t('sendCode')}
            </Button>
          )
          : null}
      </Wrapper>

    );
  }
}

AuthItem.defaultProps = {
  checked: false,
  onSubmit: null,
};

AuthItem.propTypes = {
  checked: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

export default AuthItem;
