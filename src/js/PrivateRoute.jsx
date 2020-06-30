/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import StorageUtils from './helpers/StorageUtils';
import Lightning from './containers/lightning/Lightning';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const hasToken = StorageUtils.getToken();
  return (
    <Route
      {...rest}
      render={
        props => (hasToken
          ? (<Component {...props} />)
          : (<Lightning {...props} />))
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PrivateRoute;
