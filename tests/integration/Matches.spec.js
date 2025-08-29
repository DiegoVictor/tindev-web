import React from 'react';
import { render, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { faker } from '@faker-js/faker';
import { toast } from 'react-toastify';

import { UserContext } from '~/contexts/User';
import { emit } from '../../mocks/socket.io-client';
import api from '~/services/api';
import history from '~/services/history';
import factory from '../utils/factory';
import Matches from '~/pages/Matches';

const apiMock = new MockAdapter(api);

describe('Matches', () => {
  it('should be able to see a list of matches', async () => {
    const matches = await factory.attrsMany('Developer', 3);
    const developer = await factory.attrs('Developer');

    const id = faker.number.int();
    const token = faker.string.uuid();

    await act(async () => {
      localStorage.setItem('tindev_user', JSON.stringify({ id, token }));
    });

    apiMock
      .onGet(`/developers/${id}`)
      .reply(200, developer)
      .onGet('/matches')
      .reply(200, matches);

    let getByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Matches />
          </Router>
        </UserContext.Provider>
      );

      getByTestId = component.getByTestId;
    });

    matches.forEach((dev) => {
      expect(getByTestId(`developer_${dev._id}`)).toBeInTheDocument();
    });
  });

  it('should not be able to see a list of matches with network error', async () => {
    const developer = await factory.attrs('Developer');

    const id = faker.number.int();
    const token = faker.string.uuid();

    await act(async () => {
      localStorage.setItem('tindev_user', JSON.stringify({ id, token }));
    });

    apiMock
      .onGet(`/developers/${id}`)
      .reply(200, developer)
      .onGet('/matches')
      .reply(400);

    const error = jest.spyOn(toast, 'error');

    await act(async () => {
      render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Matches />
          </Router>
        </UserContext.Provider>
      );
    });

    expect(error).toHaveBeenCalledWith(
      'Ops! Não foi possivel carregar os seus matches, tente recarregar a página!'
    );
  });

  it('should be able to show a match', async () => {
    const matchDeveloper = await factory.attrs('Developer');
    const developers = await factory.attrsMany('Developer', 3);
    const developer = await factory.attrs('Developer');

    const id = faker.number.int();
    const token = faker.string.uuid();

    await act(async () => {
      localStorage.setItem('tindev_user', JSON.stringify({ id, token }));
    });

    apiMock
      .onGet(`/developers/${id}`)
      .reply(200, developer)
      .onGet('/developers')
      .reply(200, developers);

    let getByAltText;
    let getByText;

    await act(async () => {
      const components = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Matches />
          </Router>
        </UserContext.Provider>
      );
      getByAltText = components.getByAltText;
      getByText = components.getByText;
    });

    await act(async () => {
      emit(matchDeveloper);
    });

    expect(getByAltText(matchDeveloper.name)).toHaveProperty(
      'src',
      matchDeveloper.avatar
    );
    expect(getByAltText("It's a Match")).toBeInTheDocument();
    expect(getByText(matchDeveloper.name)).toBeInTheDocument();
    expect(getByText(matchDeveloper.bio)).toBeInTheDocument();
  });
});
