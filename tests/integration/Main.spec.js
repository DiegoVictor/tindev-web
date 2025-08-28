import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';

import { UserContext } from '~/contexts/User';
import { emit } from '../../mocks/socket.io-client';
import api from '~/services/api';
import history from '~/services/history';
import factory from '../utils/factory';
import Main from '~/pages/Main';

describe('Main', () => {
  const id = faker.number.int();
  const token = faker.string.uuid();
  const apiMock = new MockAdapter(api);

  beforeAll(async () => {
    const developer = await factory.attrs('Developer');

    localStorage.setItem('tindev_user', JSON.stringify({ id, token }));
    apiMock.onGet(`/developers/${id}`).reply(200, developer);
  });

  it('should be able to see a list of developers', async () => {
    const developers = await factory.attrsMany('Developer', 3);
    apiMock.onGet('/developers').reply(200, developers);

    let getByTestId;
    let getByAltText;
    let getByText;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Main match={{ params: { id } }} />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
      getByAltText = component.getByAltText;
      getByText = component.getByText;
    });

    developers.forEach(dev => {
      expect(getByTestId(`developer_${dev._id}`)).toBeInTheDocument();
      expect(getByAltText(dev.name)).toHaveProperty('src', dev.avatar);
      expect(getByText(dev.name)).toBeInTheDocument();
      expect(getByText(dev.bio)).toBeInTheDocument();
    });
  });

  it('should not be able to see a list of developers suggested', async () => {
    apiMock.onGet('/developers').reply(200, []);

    let getByText;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Main match={{ params: { id } }} />
          </Router>
        </UserContext.Provider>
      );
      getByText = component.getByText;
    });

    expect(getByText('Sem sugestões no momento :(')).toBeInTheDocument();
  });

  it('should not be able to see a list of developers with network error', async () => {
    const error = jest.spyOn(toast, 'error');

    await factory.attrsMany('Developer', 3);
    apiMock.onGet('/developers').reply(400);

    await act(async () => {
      render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Main match={{ params: { id } }} />
          </Router>
        </UserContext.Provider>
      );
    });

    expect(error).toHaveBeenCalledWith(
      'Ops! Não foi possivel carregar os desenvolvedores, tente recarregar a página!'
    );
  });

  it('should be able to like a developer', async () => {
    const [developer, ...rest] = await factory.attrsMany('Developer', 3);
    apiMock
      .onGet('/developers')
      .reply(200, [developer, ...rest])
      .onPost(`/developers/${developer._id}/like`)
      .reply(200);

    let getByTestId;
    let queryByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Main />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`developer_like_${developer._id}`));
    });

    expect(
      queryByTestId(`[data-testid="developer_${developer._id}"]`)
    ).toBeNull();
  });

  it('should not be able to like a developer with network error', async () => {
    const [developer, ...rest] = await factory.attrsMany('Developer', 3);
    const error = jest.spyOn(toast, 'error');

    apiMock
      .onGet('/developers')
      .reply(200, [developer, ...rest])
      .onPost(`/developers/${developer._id}/like`)
      .reply(400);

    let getByTestId;
    let queryByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Main />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`developer_like_${developer._id}`));
    });

    expect(
      queryByTestId(`[data-testid="developer_${developer._id}"]`)
    ).toBeNull();
    expect(error).toHaveBeenCalledWith(
      'Ops! Não foi possivel dar like neste desenvolvedor, tente novamente!'
    );
  });

  it('should be able to dislike a developer', async () => {
    const [developer, ...rest] = await factory.attrsMany('Developer', 3);
    apiMock
      .onGet('/developers')
      .reply(200, [developer, ...rest])
      .onPost(`/developers/${developer._id}/dislike`)
      .reply(200);

    let getByTestId;
    let queryByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Main />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`developer_dislike_${developer._id}`));
    });

    expect(
      queryByTestId(`[data-testid="developer_${developer._id}"]`)
    ).toBeNull();
  });

  it('should not be able to dislike a developer with network error', async () => {
    const [developer, ...rest] = await factory.attrsMany('Developer', 3);
    const error = jest.spyOn(toast, 'error');

    apiMock
      .onGet('/developers')
      .reply(200, [developer, ...rest])
      .onPost(`/developers/${developer._id}/dislike`)
      .reply(400);

    let getByTestId;
    let queryByTestId;

    await act(async () => {
      const component = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Main />
          </Router>
        </UserContext.Provider>
      );
      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`developer_dislike_${developer._id}`));
    });

    expect(
      queryByTestId(`[data-testid="developer_${developer._id}"]`)
    ).toBeNull();
    expect(error).toHaveBeenCalledWith(
      'Ops! Não foi possivel dar dislike neste desenvolvedor, tente novamente!'
    );
  });

  it('should be able to show a match', async () => {
    const match_developer = await factory.attrs('Developer');
    const developers = await factory.attrsMany('Developer', 3);
    let getByAltText;
    let getByText;

    apiMock.onGet('/developers').reply(200, developers);

    await act(async () => {
      const components = render(
        <UserContext.Provider value={{ id, token }}>
          <Router history={history}>
            <Main />
          </Router>
        </UserContext.Provider>
      );
      getByAltText = components.getByAltText;
      getByText = components.getByText;
    });

    await act(async () => {
      emit(match_developer);
    });

    expect(getByAltText(match_developer.name)).toHaveProperty(
      'src',
      match_developer.avatar
    );
    expect(getByAltText("It's a Match")).toBeInTheDocument();
    expect(getByText(match_developer.name)).toBeInTheDocument();
    expect(getByText(match_developer.bio)).toBeInTheDocument();
  });
});
