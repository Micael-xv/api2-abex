import nome from '../controllers/nomesController';

export default (app) => {
  app.post('/nomes/persist', nome.persist);
  app.post('/nomes/persist/:id', nome.persist);
  app.post('/nomes/destroy', nome.destroy);
  app.put('/nomes/update', nome.update);
  app.get('/nomes', nome.get);
  app.get('/nomes/:id', nome.get);
};