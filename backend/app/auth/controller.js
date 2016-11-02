var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var config = require('../../config');

/*Usuario Model*/
var Usuario = require('../usuario/model');

/*Usuario Routes*/
exports.login = login;
exports.cadastro = cadastro;

function login(req, res) {
    Usuario.findOne(
          { login: req.body.login }, //Where em branco traz tudo
          {}, //campos a trazer no resultado
          function (err, user) { //o que fazer com o resultado
            if (!user) {
                res.json({ success: false, message: 'Usuário não encontrado', login: req.body.login });
            } else {
                bcrypt.compare(req.body.password, user.password, function (err, ok) {
                    if (ok) {
                        var beAToken = {};
                        beAToken.login = user.login;
                        beAToken.role = user.role;
                        var token = jwt.sign(beAToken, config.secret, {
                            expiresIn: '365d', // expires in 24 hours
                        });

                        // return the information including token as JSON
                        res.json({
                            success: true,
                            message: 'Login efetuado com sucesso!',
                            token: token,
                        });

                    } else {
                        res.json({ success: false, message: 'Usuário não encontrado' });
                    }
                });
            }
        }
    );
}

function cadastro(req, res) {
    var usuario = new Usuario(req.body);
    usuario.role = 'USER';

    usuario.save(function (err, doc) {
        login(req, res);
    });
}
