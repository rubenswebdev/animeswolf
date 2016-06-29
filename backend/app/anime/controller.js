/* Model*/
var Model = require('./model');
var Genre = require('./genre');
var Theme = require('./theme');
var bcrypt = require('bcrypt-nodejs');

/* Routes*/
exports.index = function (req, res) {
    var texto = req.body.text;

    var filtro = {};
    //filtro.rating = {$exists:true};
    //filtro["pictures.height"] = {$exists:true};

    if (texto) {
        texto = decodeURI(texto);
        filtro.$or = [];
        filtro.$or.push({ name: { $regex: texto, $options: 'ig' } });
        filtro.$or.push({ 'alternative_titles.text': { $regex: texto, $options: 'ig' } });
    }

    if (req.body.genres) {
        filtro.genres = req.body.genres;
    }

    if (req.body.themes) {
        filtro.themes = req.body.themes;
    }

    console.log(filtro);

    var skip = parseInt(req.body.skip) || 0;
    var limit = parseInt(req.body.limit) || 25;

    //db.animes.find({"pictures.height": {$exists: true} }, {"pictures":1}).sort({"pictures.height": 1});
    Model.find(filtro)
     .select('name rating pictures type votes')
     .skip(skip).limit(limit)
     .sort({ votes: -1 })
     .exec(function (err, data) { //o que fazer com o resultado
        Model.find(filtro).count()
        .exec(function (err, total) {
            var response = {};
            response.total = total;
            response.data = data;
            res.json(response);
        });

    });
};

exports.genres = function (req, res) {
    Genre.find({})
     .sort({ name: 1 })
     .exec(function (err, docs) {
        if (err) {
            console.log(err);
        }

        res.json(docs);
    });
};

exports.themes = function (req, res) {
    Theme.find({})
     .sort({ name: 1 })
     .exec(function (err, docs) {
        if (err) {
            console.log(err);
        }

        res.json(docs);
    });
};

exports.inativos = function (req, res) {
    var texto = req.params.text;

    var filtro = {};
    filtro.ativo = false;

    if (texto) {
        texto = decodeURI(texto);
        filtro.$or = [];
        filtro.$or.push({ nome: { $regex: texto, $options: 'ig' } });
    }

    Model.find(filtro)
     .skip(req.params.skip || 0).limit(req.params.limit || 25)
     .exec(function (err, data) { //o que fazer com o resultado

        Model.find(filtro).count()
        .exec(function (err, total) {
            var response = {};
            response.total = total;
            response.data = data;
            res.json(response);
        });

    });
};

exports.get = function (req, res) {
    Model.findOne(
      { _id: req.params.id },// Where
      { password: 0 },
      function (err, data) { // o que fazer com o resultado
        res.json(data);
    }
    );
};

exports.new = function (req, res) {
    var model = new Model(req.body);
    model.save(function (err, data) {
        //err null quando ta tudo certo, data traz o model inserido,
        if (!err && data) {
            //form apenas para debugar
            res.json({ success: true, data: data, err: err, form: req.body });
        } else {
            res.json({ success: false, data: data, err: err, form: req.body });
        }
    });
};

exports.delete = function (req, res) {
    Model.remove({ _id: req.params.id }, function (err, data) {
        res.json(data);
    });
};

exports.edit = function (req, res) {

    Model.findOne(
     { _id: req.body._id },
     function (err, model) {
        model.password = req.body.password;
        model.login = req.body.login;
        model.nome = req.body.nome;
        model.email = req.body.email;

        model.save(function (err, data) {
            if (!err && data) {
                res.json({ success: true, data: data, err: err, form: req.body });
            } else {
                res.json({ success: false, data: data, err: err, form: req.body });
            }
        });
    }
    );
};
