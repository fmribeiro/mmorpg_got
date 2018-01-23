module.exports.index = function(application, req, res) {
  res.render("index", { validacao: {}, dadosForm: {} });
};

module.exports.autenticar = function(application, req, res) {
  var dadosForm = req.body;

  req.assert("usuario", "Usuário não pode ser nulo").notEmpty();
  req.assert("senha", "Senha não pode ser nula").notEmpty();

  var erros = req.validationErrors();

  if (erros) {
    res.render("index", { validacao: erros, dadosForm: dadosForm });
    return;
  }

  var connection = application.config.dbConnection;
  var usuariosDAO = new application.app.models.UsuariosDAO(connection);

  usuariosDAO.autenticar(dadosForm, req, res);
};
