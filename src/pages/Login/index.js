import React, { useContext, useCallback } from 'react';
import { Form, Input } from '@rocketseat/unform';
import { toast } from 'react-toastify';

import Logo from '~/assets/logo.svg';
import { UserContext } from '~/contexts/User';
import api, { setAuthorization } from '~/services/api';
import history from '~/services/history';
import { Container, Button } from './styles';

export default () => {
  const user = useContext(UserContext);

  const handleSubmit = useCallback(
    async ({ username }) => {
      try {
        const { data } = await api.post('developers', { username });

        localStorage.setItem(
          'tindev_user',
          JSON.stringify({
            token: data.token,
            id: data.developer._id,
          })
        );
        user.id = data.developer._id;
        user.token = data.token;

        setAuthorization(data.token);

        history.push('/developers');
      } catch (err) {
        toast.error('Ops! Não foi possivel fazer seu login, tente novamente!');
      }
    },
    [user.id, user.token]
  );

  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit}>
          <img src={Logo} alt="Tindev" />
          <Input
            name="username"
            type="text"
            placeholder="Digite seu usuário no Github"
            required
          />
          <Button data-testid="login" type="submit">
            Enviar
          </Button>
        </Form>
      </Container>
    </>
  );
};
