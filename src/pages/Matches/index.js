import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import { connect, subscribe, disconnect } from '~/services/socket';
import Match from '~/components/Match';
import Menu from '~/components/Menu';
import { Developers, Developer, Avatar, Description, Bio } from './styles';

export default () => {
  const [developer, setDeveloper] = useState(null);
  const [matches, setMatches] = useState([]);
  const { id } = useContext(UserContext);

  useEffect(() => {
    disconnect();
    connect({ developer_id: id });
    subscribe('match', dev => {
      setDeveloper(dev);
    });
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('matches');
        setMatches(data);
      } catch (error) {
        toast.error(
          'Ops! Não foi possivel carregar os seus matches, tente recarregar a página!'
        );
      }
    })();
  }, [id]);

  return (
    <>
      <Menu active="matches" />

      <Developers>
        {matches.map(match => (
          <Developer key={match._id} data-testid={`developer_${match._id}`}>
            <Avatar src={match.avatar} />
            <Description>
              <strong>{match.name}</strong>
              <Bio>{match.bio}</Bio>
            </Description>
          </Developer>
        ))}
      </Developers>

      {developer && <Match developer={developer} setDeveloper={setDeveloper} />}
    </>
  );
};
