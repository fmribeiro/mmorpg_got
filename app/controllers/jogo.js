module.exports.jogo = function(application, req, res) {
  if (req.session.autorizado !== true) {
    res.render("index", { validacao: {}, dadosForm: {} });
  }
  var msg = "";

  if (req.query.msg != '') {
    msg = req.query.msg;
  }

  var usuario = req.session.usuario;
  var casa = req.session.casa;

  var connection = application.config.dbConnection;
  var jogoDAO = new application.app.models.JogoDAO(connection);

  jogoDAO.iniciaJogo(usuario, casa, res, msg);
};

module.exports.sair = function(application, req, res) {
  req.session.destroy(function(err) {
    res.render("index", { validacao: {}, dadosForm: {} });
  });
};

module.exports.suditos = function(application, req, res) {
  if (req.session.autorizado !== true) {
    res.render("index", { validacao: {}, dadosForm: {} });
  }
  res.render("aldeoes", { validacao: {} });
};

module.exports.pergaminhos = function(application, req, res) {
  if (req.session.autorizado !== true) {
    res.render("index", { validacao: {}, dadosForm: {} });
  }

  var connection = application.config.dbConnection;
  var jogoDAO = new application.app.models.JogoDAO(connection);

  var usuario = req.session.usuario;

  jogoDAO.getAcoes(usuario, res);

};

module.exports.ordenar_acao_sudito = function(application, req, res) {
  if (req.session.autorizado !== true) {
    res.render("index", { validacao: {}, dadosForm: {} });
  }
  var dadosForm = req.body;

  req.assert("acao", "Informe a ação").notEmpty();
  req.assert("quantidade", "Informe a quantidade").notEmpty();

  var erros = req.validationErrors();

  if (erros) {
    //usa o redirect para poder chamar o controller do jogo que realiza alguma acoes antes
    //de carregar a pagina
    res.redirect("jogo?msg=E");
    return;
  }
  var connection = application.config.dbConnection;
  var JogoDAO = new application.app.models.JogoDAO(connection);

  dadosForm.usuario = req.session.usuario;
  JogoDAO.acao(dadosForm);

  res.redirect("jogo?msg=S");
};
