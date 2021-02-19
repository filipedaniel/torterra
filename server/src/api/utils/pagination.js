/**
 * @param {Object}              [query={}]
 * @param {Object}              [options={}]
 * @param {Object|String}       [options.select='']
 * @param {Object|String}       [options.projection={}]
 * @param {Object}              [options.options={}]
 * @param {Object|String}       [options.sort]
 * @param {Array|Object|String} [options.populate]
 * @param {Number}              [options.page=1]
 * @param {Number}              [options.limit=10]
 *
 * @returns {Promise}
 */

const defaultOptions = {
  customLabels: {
    totalDocs: "total",
    limit: "limit",
    page: "page",
    totalPages: "pages",
    docs: "docs"
  },
  collation: {},
  limit: 10,
  //sort: { updatedAt: -1 },
  sort: { createdAt: -1 },
  projection: {},
  select: "",
  options: {}
};

function paginate(query, options = {}, callback) {
  options = {
    ...defaultOptions,
    ...paginate.options,
    ...options
  };
  
  query = query || {};

  const {
    collation,
    populate,
    projection,
    select,
    sort
  } = options;

  const customLabels = {
    ...defaultOptions.customLabels
  };

  const limit = parseInt(options.limit, 10) || 0;

  const isCallbackSpecified = typeof callback === "function";
  const findOptions = options.options;

  let offset;
  let page;
  let skip;

  let docsPromise = [];
  // const docs = [];

  // Labels
  const labelDocs = customLabels.docs;
  const labelLimit = customLabels.limit;
  const labelPage = customLabels.page;
  const labelTotal = customLabels.totalDocs;
  const labelTotalPages = customLabels.totalPages;

  /* if (options.hasOwnProperty('offset')) {
    offset = parseInt(options.offset, 10);
    skip = offset;
  } else */
  // if (options.hasOwnProperty("page")) {
  if (Object.prototype.hasOwnProperty.call(options, "page")) {
    page = parseInt(options.page, 10);
    skip = (page - 1) * limit;
  } else {
    offset = 0;
    page = 1;
    skip = offset;
  }

  const countPromise = this.countDocuments(query).exec();
  
  if (limit) {
    const mQuery = this.find(query, projection, findOptions);
    mQuery.select(select);
    mQuery.sort(sort);

    // Hack for mongo < v3.4
    if (Object.keys(collation).length > 0)
      mQuery.collation(collation);


    mQuery.skip(skip);
    mQuery.limit(limit);

    if (populate)
      mQuery.populate(populate);

    docsPromise = mQuery.exec();
  }

  return Promise.all([countPromise, docsPromise])
    .then((values) => {
      const [count, docs] = values;
      const meta = {
        [labelTotal]: count,
        [labelLimit]: limit
      };
      let result = {};

      if (typeof page !== "undefined") {
        const pages = (limit > 0) ? (Math.ceil(count / limit) || 1) : null;

        meta[labelPage] = page;
        meta[labelTotalPages] = pages;
      }

      result = {
        ...meta,
        [labelDocs]: docs
      };

      return isCallbackSpecified ? callback(null, result) : Promise.resolve(result);
    }).catch((error) => (isCallbackSpecified ? callback(error) : Promise.reject(error)));
}

/**
 * @param {Schema} schema
 */
module.exports = (schema) => {
  schema.statics.paginate = paginate;
};

module.exports.paginate = paginate;
