import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Match from '~/components/Match';
import factory from '../utils/factory';

describe('Match', () => {
  it('should be able to the match information', async () => {
    const { avatar, bio, name } = await factory.attrs('Developer');
    const developer = {
      avatar,
      bio,
      name,
    };

    const { getByAltText, getByText, getByTestId } = render(
      <Match developer={developer} setDeveloper={jest.fn()} />
    );

    expect(getByAltText(name)).toHaveProperty('src', avatar);
    expect(getByAltText("It's a Match")).toBeInTheDocument();
    expect(getByText(name)).toBeInTheDocument();
    expect(getByText(bio)).toBeInTheDocument();

    expect(getByTestId('close')).toBeInTheDocument();
  });

  it('should be able to the close the match', async () => {
    const developer = await factory.attrs('Developer');
    const setDeveloper = jest.fn();

    const { getByTestId } = render(
      <Match developer={developer} setDeveloper={setDeveloper} />
    );

    fireEvent.click(getByTestId('close'));

    expect(setDeveloper).toHaveBeenCalledWith(null);
  });
});
