import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import Login from '~/pages/Login';

jest.mock('~/services/history');

describe('Login', () => {
  const apiMock = new MockAdapter(api);

  beforeEach(() => {
    localStorage.clear();
  });

  it('should be able to login', async () => {
    const user = {};
    const username = faker.internet.userName();
    const id = faker.random.number();
    const token = faker.random.uuid();

    apiMock
      .onPost('developers', { username })
      .reply(200, { token, developer: { _id: id } });

    history.push.mockImplementation(jest.fn());

    const { getByPlaceholderText, getByTestId } = render(
      <UserContext.Provider value={user}>
        <Login />
      </UserContext.Provider>
    );

    fireEvent.change(getByPlaceholderText('Digite seu usuário no Github'), {
      target: {
        value: username,
      },
    });

    await act(async () => {
      fireEvent.click(getByTestId('login'));
    });

    expect(history.push).toHaveBeenCalledWith(`/developers`);
    expect(user).toStrictEqual({ id, token });
    expect(localStorage.getItem('tindev_user')).toBe(
      JSON.stringify({
        token,
        id,
      })
    );
  });

  it('should not be able to login with networ error', async () => {
    const user = {};
    const username = faker.internet.userName();
    const error = jest.spyOn(toast, 'error');

    apiMock.onPost('developers', { username }).reply(400);
    history.push.mockImplementation(jest.fn());

    const { getByPlaceholderText, getByTestId } = render(
      <UserContext.Provider value={user}>
        <Login />
      </UserContext.Provider>
    );

    fireEvent.change(getByPlaceholderText('Digite seu usuário no Github'), {
      target: {
        value: username,
      },
    });

    await act(async () => {
      fireEvent.click(getByTestId('login'));
    });

    expect(history.push).not.toHaveBeenCalled();
    expect(user).toStrictEqual({});
    expect(localStorage.getItem('tindev_user')).toBe(null);
    expect(error).toHaveBeenCalledWith(
      'Ops! Não foi possivel fazer seu login, tente novamente!'
    );
  });
});
