import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nomequequiserchamar from '../models/nomeModel';

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      const response = await nomequequiserchamar.findAll({
        order: [['id', 'asc']],
      });
      return res.status(200).send({
        type: 'success',
        message: 'Registros carregados com sucesso',
        data: response,
      });
    }

    const response = await nomequequiserchamar.findOne({ where: { id } });

    if (!response) {
      return res.status(200).send({
        type: 'error',
        message: `Nenhum registro com id ${id}`,
        data: [],
      });
    }

    return res.status(200).send({
      type: 'success',
      message: 'Registro carregado com sucesso',
      data: response,
    });
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

const create = async (dados, res) => {
  const {
    nomequequiserchamarname,
    name,
    phone,
    passwordHash,
    role,
    cpf,
    email,
  } = dados;

  const response = await nomequequiserchamar.create({
    nomequequiserchamarname,
    name,
    phone,
    passwordHash,
    role,
    cpf,
    email,
  });

  return res.status(200).send({
    type: 'success',
    message: 'Cadastro realizado com sucesso',
    data: response,
  });
};

const update = async (id, dados, res) => {
  const response = await nomequequiserchamar.findOne({ where: { id } });

  if (!response) {
    return res.status(200).send({
      type: 'error',
      message: `Nenhum registro com id ${id} para atualizar`,
      data: [],
    });
  }

  Object.keys(dados).forEach((field) => (response[field] = dados[field]));

  await response.save();
  return res.status(200).send({
    type: 'success',
    message: `Registro id ${id} atualizado com sucesso`,
    data: response,
  });
};

const persist = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      return await create(req.body, res);
    }

    return await update(id, req.body, res);
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error,
    });
  }
};

const destroy = async (req, res) => {
  try {
    const id = req.body.id ? req.body.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      return res.status(200).send({
        type: 'error',
        message: 'Informe um id para deletar o registro',
        data: [],
      });
    }

    const response = await nomequequiserchamar.findOne({ where: { id } });

    if (!response) {
      return res.status(200).send({
        type: 'error',
        message: `Nenhum registro com id ${id} para deletar`,
        data: [],
      });
    }

    await response.destroy();
    return res.status(200).send({
      type: 'success',
      message: `Registro id ${id} deletado com sucesso`,
      data: [],
    });
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const {
      nomequequiserchamarname, name, phone, password, role, cpf, email,
    } = req.body;

    const existingnomequequiserchamar = await nomequequiserchamar.findOne({
      where: { email },
    });

    if (existingnomequequiserchamar) {
      throw new Error('Email já foi utilizado!');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const response = await nomequequiserchamar.create({
      nomequequiserchamarname,
      name,
      phone,
      passwordHash,
      role,
      cpf,
      email,
    });

    return res.status(201).send({
      message: 'Criado!',
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Ops!',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const nomequequiserchamar = await nomequequiserchamar.findOne({
      where: { email },
    });

    if (!nomequequiserchamar) {
      throw new Error('Usuário ou senha inválidos!');
    }

    const { passwordHash } = nomequequiserchamar;
    console.log(`${password} ${passwordHash}`);
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (isPasswordValid) {
      const token = jwt.sign(
        { nomequequiserchamarId: nomequequiserchamar.id, nomequequiserchamarName: nomequequiserchamar.name },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
      );

      return res.status(200).send({ token });
    }

    return res.status(400).send({ message: 'Usuário ou senha inválidos!' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      message: 'Ops!',
      error: error.message,
    });
  }
};

export default {
  get,
  update,
  persist,
  destroy,
  register,
  login,
};