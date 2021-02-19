const Joi = require("@hapi/joi");

const dossierSchemas = {
  post: Joi.object().keys({
    title: Joi.string().required().error(() => "O título é obrigatório!"),
    description: Joi.string().error(() => "A descrição tem de ser uma 'string'!"),
    image: Joi.string().uri({ scheme: ["http", "https"] }).error(() => "A imagem deve ter um URL válido (http/https)!")
  }),
  patch: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string().error(() => "A descrição tem de ser uma 'string'!"),
    image: Joi.string().uri({ scheme: ["http", "https"] }).error(() => "A logo deve ter um URL válido (http/https)!")
  })
};

module.exports = dossierSchemas;
