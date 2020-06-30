import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import Root from './Root';
import { SENTRY_DSN } from './config';

Sentry.init({ dsn: SENTRY_DSN });

ReactDOM.render(
  <Root />,
  document.getElementById('app'),
);
