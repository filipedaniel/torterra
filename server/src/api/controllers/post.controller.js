const mongoose = require("mongoose");
const httpStatus = require("http-status");
const aqp = require("api-query-params");

const funcsUtils = require("../utils/funcs");
const APIError = require("../utils/APIError");

const Post = require("../models/post.model");
const Dossier = require("./../models/dossier.model");

/**
 * Get All Posts
 */
exports.getAllPosts = async (req, res, next) => {
  try {
    const { query, options } = funcsUtils.queryParser(req.query, ["title", "slug"]);
    
    if (!options.sort) {
      options.sort = { date : -1};
    }
    
    const result = await Post.paginate(query, options);
    res.status(200).jsonp(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Get post by :id
 */
exports.getPostById = async (req, res, next) => {
  try {
    const { projection } = aqp(req.query);

    const result = await Post.findById(req.params.id).select(projection);

    if (!result)
      return next(new APIError({
        message: "Post not found!",
        status: httpStatus.NOT_FOUND
      }));

    res.status(httpStatus.OK).jsonp(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Get Post by :slug
 */
exports.getPostBySlug = async (req, res, next) => {
  try {
    const { projection, population } = aqp(req.query);

    const slug = req.params.slug;
    if (!funcsUtils.validateSlug(slug))
      return next(new APIError({
        message: "Post not found!",
        status: httpStatus.NOT_FOUND
      }));

    const result = await Post.findOne({ slug: slug }).populate(population).select(projection);

    if (!result)
      return next(new APIError({
        message: "Post not found!",
        status: httpStatus.NOT_FOUND
      }));

    res.status(200).jsonp(result);
  } catch (err) {
    next(err);
  }
};

/**
 * POST Add new post
 */
exports.postPost = async (req, res, next) => {
  try {
    const title = req.body.title;

    const slug = funcsUtils.slugify(title);
    const checkPost = await Post.countDocuments({ slug: slug });
    if (checkPost === 1)
      return next(new APIError({
        message: `Post alredy exists: '${title}'!`,
        status: httpStatus.CONFLICT
      }));


    const description = req.body.description || "";
    const featureImage = req.body.featureImage;
    const images = req.body.images || [];

    const content = req.body.content;
    let date = req.body.date;
    if (!req.body.date)
      date = (new Date()).toISOString();


    const author = req.body.author;

    let dossierId = req.body.dossier;

    if (dossierId && mongoose.Types.ObjectId.isValid(dossierId)) {
      const checkDossier = await Dossier.exists({ _id: dossierId });
      if (!checkDossier)
      dossierId = null;
    } else {
      dossierId = null;
    }


    const post = new Post({
      _id: mongoose.Types.ObjectId(),
      title: title,
      slug: slug,
      description: description,
      featureImage: featureImage,
      images: images,
      content: content,
      date: date,
      author: author,
      dossier: dossierId
    });

    const savePost = await post.save();
    res.status(201).jsonp(savePost);
  } catch (err) {
    next(err);
  }
};

exports.patchPost = async (req, res, next) => {
  try {
    const id = req.params.id;

    const updateOps = {};

    if (req.body.title) {
      updateOps.title = req.body.title.trim();
      const slugTemp = await funcsUtils.slugify(updateOps.title);
      const checkPost = await Post.countDocuments({ slug: slugTemp });
      if (checkPost === 1)
        return next(new APIError({
          message: `Post already exists: '${updateOps.title}'!`,
          status: httpStatus.CONFLICT
        }));

      updateOps.slug = slugTemp;
    }

    if (req.body.description)
      updateOps.description = req.body.description.trim()

    if (req.body.featureImage)
      updateOps.featureImage = req.body.featureImage.trim();


    if (req.body.images)
      updateOps.images = req.body.images;


    if (req.body.content)
      updateOps.content = req.body.content;


    if (req.body.date)
      updateOps.date = req.body.date;


    if (req.body.author)
      updateOps.author = req.body.author;


    if (req.body.dossier == undefined || req.body.dossier === "" || req.body.dossier === null)
      updateOps.dossier = null;
    else {
      const dossierId = req.body.dossier;
      if (mongoose.Types.ObjectId.isValid(dossierId)) {
        const checkDossier = await Dossier.exists({ _id: dossierId });
        if (checkDossier)
          updateOps.dossier = dossierId;
      }
    }


    const result = await Post.findById(id);
    if (!result)
      return next(new APIError({
        message: "Post not found!",
        status: httpStatus.NOT_FOUND
      }));


    await Post.findOneAndUpdate({ _id: id }, { $set: updateOps });
    const updatePost = await Post.findById(id);
    res.status(200).jsonp(updatePost);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete post
 */
exports.deletePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Post.findById(id);

    if (!result)
      return next(new APIError({
        message: "Post not found!",
        status: httpStatus.NOT_FOUND
      }));


    const deletePost = await Post.remove({ _id: id });

    res.status(httpStatus.OK).jsonp({
      docs: deletePost
    });
  } catch (err) {
    next(err);
  }
};
