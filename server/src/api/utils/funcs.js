const aqp = require("api-query-params");

module.exports = {

  /**
   * @param {string} text function to slugify a name
   */
  slugify: (text) => {
    let slug = text.toString().toLowerCase().trim()
      .replace(/\s+/g, "-")
      .replace(/&/g, "-and-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
    return slug;
  },
  
  validateSlug: (slug) => {
    const regex = /^[a-z][a-z\-]*[a-z]/;
    return regex.test(slug);
  },
  /**
   *
   * @param {string} url validate url
   */
  validateUrl: function (url) {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(url))
      return false;

    return true;
  },

  /**
   * @param {string} email validate email
   */
  validateEmail: (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },

  /**
   * @param {} _ returns a ramdom string with length 10
   */
  generatePassword: () => {
    const password = Math.random().toString(36).slice(-10);
    // const password = "admin";
    return password;
  },

  /**
   *
   * @param {object} queryString query string option base one pakache aqp
   * @param {array} params list of params that the search by apply
   */
  queryParser: function (queryString = "", params = []) {
    const { filter, limit, sort, projection, population } = aqp(queryString);

    delete filter.page;

    const page = queryString.page;
    const search = queryString.search || "";

    const options = {
      limit: limit || 10,
      page: page || 1
    };
    if (projection)
      options.select = projection;
    if (sort)
      options.sort = sort;
    if (population)
      options.populate = population;

    const query = {};
    if (search !== "") {
      delete filter.search;
      if (params.length > 0) {
        query.$or = [];
        params.forEach((param) => {
          const obj = {};
          obj[param] = new RegExp(search, "i");
          query.$or.push(obj);
        });
      }
    }
    const result = {};
    result.query = { ...query, ...filter };
    result.options = options;

    return result;
  }
};
