const mongoose = require("mongoose");
const httpStatus = require("http-status");
const aqp = require("api-query-params");

const Dossier = require("./../models/dossier.model");
const Post = require("./../models/post.model");

const funcsUtils = require("../utils/funcs");
const APIError = require("../utils/APIError");

/**
 * Get All dossiers
 */
exports.getAllDossiers = async (req, res, next) => {
  try {
    const { query, options } = funcsUtils.queryParser(req.query, ["title", "slug"]);
    const result = await Dossier.paginate(query, options);
    res.status(200).jsonp(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Get Dossier by :id
 */
exports.getDossierById = async (req, res, next) => {
  try {
    const { projection } = aqp(req.query);

    const result = await Dossier.findById(req.params.id).select(projection);

    if (!result)
      return next(new APIError({
        message: "Dossier not found!",
        status: httpStatus.NOT_FOUND
      }));

    res.status(httpStatus.OK).jsonp(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Get Dossier by :slug
 */
exports.getDossierBySlug = async (req, res, next) => {
  try {
    const { projection } = aqp(req.query);
    const slug = req.params.slug;

    if (!funcsUtils.validateSlug(slug))
      return next(new APIError({
        message: "Dossier not found!",
        status: httpStatus.NOT_FOUND
      }));


    const result = await Dossier.findOne({ slug: slug }).select(projection);

    if (!result)
      return next(new APIError({
        message: "Dossier not found!",
        status: httpStatus.NOT_FOUND
      }));

    res.status(200).jsonp(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all posts from dossier by dossier :id
 */
exports.getDossierPosts = async (req, res, next) => {
  try {
    const { query, options } = funcsUtils.queryParser(req.query, ["title", "slug"]);

    if (!options.sort) {
      options.sort = { date : -1};
    }

    const slug = req.params.slug;
    if (!funcsUtils.validateSlug(slug))
      return next(new APIError({
        message: "Dossier not found!",
        status: httpStatus.NOT_FOUND
      }));

    const dossier = await Dossier.findOne({ slug: slug });
    if (!dossier)
      return next(new APIError({
        message: "Dossier not found!",
        status: httpStatus.NOT_FOUND
      }));


    query.dossier = dossier._id;

    const result = await Post.paginate(query, options);
    res.status(httpStatus.OK).jsonp(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Post Dossier
 */
exports.postDossier = async (req, res, next) => {
  try {
    const title = req.body.title;

    const slug = funcsUtils.slugify(title);
    const checkDossier = await Dossier.countDocuments({ slug: slug });

    if (checkDossier === 1)
      return next(new APIError({
        message: `Dossier already exists: '${title}'!`,
        status: httpStatus.CONFLICT
      }));


    const description = req.body.description;
    const image = req.body.image;
    
    const dossier = new Dossier({
      _id: mongoose.Types.ObjectId(),
      title: title,
      slug: slug,
      description: description,
      image: image
    });

    const saveDossier = await dossier.save();
    res.status(201).jsonp(saveDossier);
  } catch (err) {
    next(err);
  }
};

/**
 * Patch Dossier
 */
exports.patchDossier = async (req, res, next) => {
  try {
    const id = req.params.id;

    const updateOps = {};
    if (req.body.title) {
      updateOps.title = req.body.title.trim();
      const slugTemp = await funcsUtils.slugify(updateOps.title);
      const checkDossier = await Dossier.countDocuments({ slug: slugTemp });
      if (checkDossier === 1)
        return next(new APIError({
          message: `Dossier already exists: '${updateOps.title}'!`,
          status: httpStatus.CONFLICT
        }));

      updateOps.slug = slugTemp;
    }

    if (req.body.image)
      updateOps.image = req.body.image.trim();


    if (req.body.description)
      updateOps.description = req.body.description.trim();


    const result = await Dossier.findById(id);

    if (!result)
      return next(new APIError({
        message: "Dossier not found!",
        status: httpStatus.NOT_FOUND
      }));


    await Dossier.findOneAndUpdate({ _id: id }, { $set: updateOps });
    const updateDossier = await Dossier.findById(id);
    res.status(httpStatus.OK).jsonp(updateDossier);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete dossier
 */
exports.deleteDossier = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Dossier.findById(id);

    if (!result)
      return next(new APIError({
        message: "Dossier not found!",
        status: httpStatus.NOT_FOUND
      }));

    // update all posts to null
    const updatePosts = await Post.updateMany({ dossier: id }, { $unset: { dossier: 1 } });
    const deleteDossier = await Dossier.remove({ _id: id });

    res.status(httpStatus.OK).jsonp({
      docs: deleteDossier,
      posts: updatePosts
    });
  } catch (err) {
    next(err);
  }
};
