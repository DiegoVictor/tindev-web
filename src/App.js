import React from 'react';
import { ToastContainer } from 'react-toastify';

import Theme, { Container } from '~/styles/theme';
export default () => {
  return (
    <Container>
      <Theme />
      <ToastContainer />
    </Container>
  );
};
