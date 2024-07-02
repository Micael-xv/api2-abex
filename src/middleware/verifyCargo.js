import jwt from 'jsonwebtoken';
import Usuario from '../models/usersModel';

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization || null;
    if (!token || token == 'Bearer') {
      return res.status(401).send({
        message: 'Não autorizado',
      });
    }
    const [_, tokenLimpo] = token.split(' ');
    const decodedToken = jwt.verify(tokenLimpo, process.env.SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).send({
        message: 'não autorizado',
      });
    }
    if (decodedToken.exp < (Date.now() / 1000)) {
      return res.status(401).send({
        message: 'Token expirado, faça login',
      });
    }

    const usuario = await Usuario.findOne({
      where: {
        id: decodedToken.userId,
      },
    });
    console.log(usuario);
    if (usuario.cargo != 'Maneger') {
      return res.status(401).send({
        message: 'Acesso não autorizado!',
      });
    }
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).send({
      message: 'Ops!',
    });
  }
};
