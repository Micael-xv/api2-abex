import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuarios from '../models/usuarioModel';

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      const response = await Usuarios.findAll({ order: [['id', 'asc']] });
      return res.status(200).send({
        type: 'success',
        message: 'Registros carregados com sucesso',
        data: response,
      });
    }

    const response = await Usuarios.findOne({ where: { id } });

    if (!response) {
      return res.status(404).send({
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
    return res.status(500).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const { nome, sobrenome, cpf, telefone, email, senha } = req.body;

    const existingEmail = await Usuarios.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).send({ type: 'error', message: 'Email já cadastrado!' });
    }

    const existingCpf = await Usuarios.findOne({ where: { cpf } });
    if (existingCpf) {
      return res.status(400).send({ type: 'error', message: 'CPF já cadastrado!' });
    }

    const passwordHash = await bcrypt.hash(senha, 10);

    const response = await Usuarios.create({
      nome,
      sobrenome,
      cpf,
      telefone,
      email,
      senha: passwordHash,
    });

    return res.status(201).send({
      type: 'success',
      message: 'Cadastro realizado com sucesso',
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

const update = async (id, dados, res) => {
  try {
    const response = await Usuarios.findOne({ where: { id } });

    if (!response) {
      return res.status(404).send({
        type: 'error',
        message: `Nenhum registro com id ${id} para atualizar`,
        data: [],
      });
    }

    Object.keys(dados).forEach((field) => {
      if (field === 'senha') {
        response[field] = bcrypt.hashSync(dados[field], 10);
      } else {
        response[field] = dados[field];
      }
    });

    await response.save();
    return res.status(200).send({
      type: 'success',
      message: `Registro id ${id} atualizado com sucesso`,
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

const persist = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      return await create(req, res);
    }

    return await update(id, req.body, res);
  } catch (error) {
    return res.status(500).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

const destroy = async (req, res) => {
  try {
    const id = req.body.id ? req.body.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      return res.status(400).send({
        type: 'error',
        message: 'Informe um id para deletar o registro',
        data: [],
      });
    }

    const response = await Usuarios.findOne({ where: { id } });

    if (!response) {
      return res.status(404).send({
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
    return res.status(500).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    return await create(req, res);
  } catch (error) {
    return res.status(500).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuarios.findOne({ where: { email } });

    if (!usuario) {
      return res.status(400).send({ message: 'Usuário ou senha inválidos!' });
    }

    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);

    if (!isPasswordValid) {
      return res.status(400).send({ message: 'Usuário ou senha inválidos!' });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).send({
      message: 'Login realizado com sucesso!',
      token,
    });
  } catch (error) {
    return res.status(500).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

export default {
  get,
  create,
  update,
  persist,
  destroy,
  register,
  login,
};
