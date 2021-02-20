const Joi = require("@hapi/joi");

const postSchemas = {
  post: Joi.object().keys({
    title: Joi.string().required().error(() => "O título é obrigatório!"),
    description: Joi.string().error(() => "A descrição tem de ser uma 'string'!"),
    featureImage: Joi.string().uri({ scheme: ["http", "https"] }).error(() => "A imagem deve ter um URL válido (http/https)!"),
    images: Joi.array().items(Joi.object().keys({url: Joi.string().uri({ scheme: ["http", "https"] })})),
    content: Joi.optional().error(() => "O conteúdo tem de ser uma 'string'!"),
    date: Joi.string().isoDate().error(() => "A Data tem de estar no formato 'isoDate'!"),
    author: Joi.string().error(() => "O autor tem de ser uma 'string'!"),
    dossier: Joi.optional()
  }),
  patch: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string().error(() => "A descrição tem de ser uma 'string'!"),
    featureImage: Joi.string().uri({ scheme: ["http", "https"] }).error(() => "A imagem deve ter um URL válido (http/https)!"),
    images: Joi.array().items(Joi.object().keys({url: Joi.string().uri({ scheme: ["http", "https"] })})),
    content: Joi.optional().error(() => "O conteúdo tem de ser uma 'string'!"),
    date: Joi.string().isoDate().error(() => "A Data tem de estar no formato 'isoDate'!"),
    author: Joi.string().error(() => "O autor tem de ser uma 'string'!"),
    dossier: Joi.optional()
  })
};

module.exports = postSchemas;
