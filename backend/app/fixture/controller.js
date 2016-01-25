/*Usuario Model*/
var Usuario = require('../usuario/model');
var moment = require('moment');

/*Usuario Routes*/
exports.usuarios = function(req, res) {
	if (req.params.w6 != "m4tr1x123") {
		res.json("denied!");
	} else {
		Usuario.findOne({"login":"admin"}, function(err, usuario) {
			if (!usuario) {
				var usuario = new Usuario();
				usuario.password = "admin";
				usuario.login = "admin";
				usuario.email = "admin@admin.com";
				usuario.nome = "Administrador";
				usuario.role = 'ADMIN'

				usuario.save(function(err, user){
					if (err) {
						res.json(err);
					} else {
						res.json(user);
					}
				});
			} else {
				res.json("admin já cadastrado!");
			}
		});
	}
}
