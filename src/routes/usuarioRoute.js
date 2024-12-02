import usuario from '../controllers/usuarioController';

export default (app) => {
  app.post('/usuario/persist', usuario.persist);
  app.post('/usuario/persist/:id', usuario.persist);
  app.post('/usuario/destroy', usuario.destroy);
  app.post('/usuario/login', usuario.login);
  app.put('/usuario/update', usuario.update);
  app.get('/usuario', usuario.get);
  app.get('/usuario/:id', usuario.get);
};
