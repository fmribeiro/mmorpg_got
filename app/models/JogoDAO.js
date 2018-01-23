function JogoDAO(connection) {
  //underline eh uma convencao q indica q a variavel deve ser usada dentro da funcao
  this._connection = connection();
}

JogoDAO.prototype.gerarParametros = function(usuario) {
  this._connection.open(function(erro, mongoClient) {
    mongoClient.collection("jogo", function(erro, collection) {
      collection.insert({
        usuario: usuario,
        moeda: 15,
        suditos: 10,
        temor: Math.floor(Math.random() * 1000),
        sabedoria: Math.floor(Math.random() * 1000),
        comercio: Math.floor(Math.random() * 1000),
        magia: Math.floor(Math.random() * 1000)
      });
      mongoClient.close();
    });
  });
};

JogoDAO.prototype.iniciaJogo = function(usuario, casa, res, msg) {
  this._connection.open(function(erro, mongoClient) {
    mongoClient.collection("jogo", function(erro, collection) {
      //verifica se o usuario e senha informado no form
      //eh igual ao cadastrado no banco
      collection
        .find({
          usuario: usuario
        })
        .toArray(function(erro, resultado) {
          mongoClient.close();
          res.render("jogo", {
            img_casa: casa,
            jogo: resultado[0],
            msg: msg
          });
        });
    });
  });
};

JogoDAO.prototype.acao = function(acao) {
  this._connection.open(function(erro, mongoClient) {
    mongoClient.collection("acao", function(erro, collection) {
      var date = new Date();
      var tempo = null;
      console.log("acao: "+acao.acao);
      switch (parseInt(acao.acao)) {
        case 1:
          tempo = 1 * 60 * 60000;
          break;
        case 2:
          tempo = 2 * 60 * 60000;
          break;
        case 3:
          tempo = 5 * 60 * 60000;
          break;
        case 4:
          tempo = 5 * 60 * 60000;
          break;
      }
      console.log("tempo: "+tempo);
      acao.acao_termina_em = date.getTime() + tempo;
      
      collection.insert({
        acao
      });
      mongoClient.close();
    });
  });
};

JogoDAO.prototype.getAcoes = function(usuario, res) {
  this._connection.open(function(erro, mongoClient) {
    mongoClient.collection("acao", function(erro, collection) {
      var date = new Date();
      var momentoAtual = date.getTime();
      collection
        .find({
          "acao.usuario": usuario,
          "acao.acao_termina_em": { $gt: momentoAtual }
        })
        .toArray(function(erro, resultado) {
          console.log(resultado);
          res.render("pergaminhos", { acoes: resultado });
          mongoClient.close();
        });
    });
  });
};

module.exports = function() {
  return JogoDAO;
};
