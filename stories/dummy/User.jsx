import React from 'react';
import { storiesOf } from '@storybook/react';
import User from '../../src/js/components/dummy/User';

storiesOf('Dummy/User', module)
  .add('default', () => {
    const user = {
      id: 2,
      full_name: 'Harry Potter',
    };
    return (
      <User user={user} />
    );
  });
