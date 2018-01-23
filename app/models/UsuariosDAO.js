function UsuariosDAO(connection) {
  //underline eh uma convencao q indica q a variavel deve ser usada dentro da funcao
  this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario) {
  this._connection.open(function(erro, mongoClient) {
    mongoClient.collection("usuarios", function(erro, collection) {
      collection.insert(usuario);
      mongoClient.close();
    });
  });
};

UsuariosDAO.prototype.autenticar = function(usuario, req, res) {
  this._connection.open(function(erro, mongoClient) {
    mongoClient.collection("usuarios", function(erro, collection) {
      //verifica se o usuario e senha informado no form
      //eh igual ao cadastrado no banco
      collection
        .find({
          usuario: usuario.usuario,
          senha: usuario.senha
        })
        .toArray(function(erro, resultado) {
          if (resultado[0] != undefined) {
            //caso exista o user no banco, cria a variavel de sessao autorizado
            req.session.autorizado = true;
            req.session.usuario = resultado[0].usuario;
            req.session.casa = resultado[0].casa;
          }
          
          if (req.session.autorizado) {
            res.redirect("jogo");
          } else {
            var erros = [{ msg: "Usuário não encontrado" }];
            res.render("index", { validacao: erros, dadosForm: {} });
          }
        });
      mongoClient.close();
    });
  });
};

module.exports = function() {
  return UsuariosDAO;
};
