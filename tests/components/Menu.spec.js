import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { Router } from 'react-router-dom';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import history from '~/services/history';
import Menu from '~/components/Menu';
import factory from '../utils/factory';

jest.mock('~/services/history');

describe('Menu', () => {
  const id = faker.random.number();
  const token = faker.random.uuid();
  const apiMock = new MockAdapter(api);

  beforeAll(() => {
    localStorage.setItem('tindev_user', JSON.stringify({ id, token }));
  });

  it('should be able to see the menu', async () => {
    const { avatar, name } = await factory.attrs('Developer');

    let getByText;
    let getByAltText;
    let getByTestId;

    apiMock.onGet(`/developers/${id}`).reply(200, { name, avatar });

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Menu active="developers" />
          </Router>
        </UserContext.Provider>
      );
      getByText = component.getByText;
      getByAltText = component.getByAltText;
      getByTestId = component.getByTestId;
    });

    expect(getByText('developers')).toBeInTheDocument();
    expect(getByText('matches')).toBeInTheDocument();
    expect(getByTestId('logout')).toBeInTheDocument();
    expect(getByAltText(name)).toHaveProperty('src', avatar);
  });

  it('should be able to logout', async () => {
    const developer = await factory.attrs('Developer');
    let getByTestId;

    history.push.mockImplementation(jest.fn());
    apiMock.onGet(`/developers/${id}`).reply(200, developer);

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Menu active="developers" />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
    });

    fireEvent.click(getByTestId('logout'));
    expect(history.push).toHaveBeenCalledWith('/');
  });
});
