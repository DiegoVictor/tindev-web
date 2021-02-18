import { toast } from 'react-toastify';

import Like from '~/assets/like.png';
import Dislike from '~/assets/dislike.png';
import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import { connect, subscribe, disconnect } from '~/services/socket';
import Layout from '~/components/Layout';
import Loading from '~/components/Loading';
import Match from '~/components/Match';
import Menu from '~/components/Menu';
import { Developers, Developer, Bio, Actions, Center } from './styles';

export default () => {
  const [developers, setDevelopers] = useState([]);
  const [developer, setDeveloper] = useState(null);
  const [preload, setPreloading] = useState(false);

  const { id } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/developers');

        setDevelopers(data);
        setPreloading(true);
      } catch (err) {
        toast.error(
          'Ops! Não foi possivel carregar os desenvolvedores, tente recarregar a página!'
        );
      }
    })();
  }, []);

  useEffect(() => {
    disconnect();
    connect({ developer_id: id });
    subscribe('match', dev => {
      setDeveloper(dev);
    });
  }, [id]);

  async function handleLike (devId) {
    try {
      await api.post(`/developers/${devId}/like`);
      setDevelopers(developers.filter(({ _id }) => _id !== devId));
    } catch (err) {
      toast.error(
        'Ops! Não foi possivel dar like neste desenvolvedor, tente novamente!'
      );
    }
  };

  async function handleDislike(dev_id) {
    await api.post(
      `/developers/${dev_id}/dislike`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  async function handleDislike (devId) {
      try {
        await api.post(`/developers/${devId}/dislike`);
        setDevelopers(developers.filter(({ _id }) => _id !== devId));
      } catch (err) {
        toast.error(
          'Ops! Não foi possivel dar dislike neste desenvolvedor, tente novamente!'
        );
      }
  };

  return (
    <Layout>
      <Menu active="developers" />

      {developers.length > 0 ? (
        <Developers>
          {developers.map(dev => (
            <Developer key={dev._id} data-testid={`developer_${dev._id}`}>
              <img src={dev.avatar} alt={dev.name} />
              <Bio>
                <strong>{dev.name}</strong>
                <p>{dev.bio}</p>
              </Bio>

              <Actions>
                <button
                  data-testid={`developer_dislike_${dev._id}`}
                  title="Sai da minha stack developer nutela"
                  type="button"
                  onClick={() => handleDislike(dev._id)}
                >
                  <img src={Dislike} alt="Dislike" />
                </button>
                <button
                  data-testid={`developer_like_${dev._id}`}
                  title="Bora #codar"
                  type="button"
                  onClick={() => handleLike(dev._id)}
                >
                  <img src={Like} alt="Like" />
                </button>
              </Actions>
            </Developer>
          ))}
        </Developers>
      ) : (
        <Center>
          {!preload ? <Loading /> : 'Sem sugestões no momento :('}
        </Center>
      )}

      {developer && <Match developer={developer} setDeveloper={setDeveloper} />}
    </Layout>
  );
};
