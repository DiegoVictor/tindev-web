import React from 'react';
import { ToastContainer } from 'react-toastify';

import Theme, { Container } from '~/styles/theme';
import Routes from '~/routes';

export default () => {
  return (
    <Container>
      <Theme />
      <ToastContainer />
      <Routes />
    </Container>
  );
};
