export default function (req, res, next) => {
  try {
    const {descricao} = req.body;
    if (!descricao) {
      throw new Error('F');
    }
    next();
  } catch (error) {
    return res.status(500).send({
      message: 'Erro no middleware',
    });
  }
};