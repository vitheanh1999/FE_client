import React from 'react'; 
import { configure , addDecorator } from '@storybook/react';
import { configureActions } from '@storybook/addon-actions';
import 'bulma/css/bulma.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MemoryRouter } from 'react-router-dom';


addDecorator(story => (
  <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
));

configureActions({
  depth: 100
})

const req = require.context('../stories', true, /.jsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
