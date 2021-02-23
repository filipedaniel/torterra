var express = require('express');
const nodemailer = require("nodemailer");
const axios = require('axios');

require("dotenv").config();

var router = express.Router();
var baseUrl = process.env.API;

/* GET home page. */
router.get('/', async (req, res, next) => {
  var page = {
    render: 'home',
    name: 'home',
    metadata: {
      title: 'Home - Torterra',
      description: 'page description',
      image: 'image-placeholder'
    }
  };

  res.render('index', { 
    page: page
  });
});

/* Get Contacts page */
router.get('/contacts', async (req, res, next) => {
  var page = {
    render: 'contact',
    name: 'contact',
    metadata: {
      title: 'Contacts | Torterra',
      description: 'page description',
      image: 'image-placeholder'
    }
  };

  res.render('index', { 
    page: page
  });
});

/* GET blog page. */
router.get('/blog', async (req, res, next) => {
  var page = {
    render: 'blog',
    name: 'blog',
    metadata: {
      title: 'Blog - Torterra',
      description: 'page description',
      image: 'image-placeholder'
    }
  };

  // let query = "limit=1";
  let query = "";
  query += '&fields=_id,title,slug,description,featureImage,date,author'
  
  if (req.query.page) {
    query += `&page=${req.query.page}`; 
  }

  try {
    const blog = await axios.get(baseUrl + '/dossier/slug/blog?&fields=_id,title,slug,description,image');
    const posts = await axios.get(baseUrl + '/dossier/slug/blog/posts?' + query);
    page.blog = blog.data;
    page.posts = posts.data;
  } catch (error) {
    page.blog = null;
    page.posts = null;
  }

  res.render('index', { 
    page: page
  });
});

/* GET projects page. */
router.get('/projects', async (req, res, next) => {
  var page = {
    render: 'projects',
    name: 'projects',
    metadata: {
      title: 'Projects - Torterra',
      description: 'page description',
      image: 'image-placeholder'
    }
  };

  // let query = "limit=1";
  let query = "";
  query += '&fields=_id,title,slug,description,featureImage,date,author'
  
  if (req.query.page) {
    query += `&page=${req.query.page}`; 
  }

  try {
    const project = await axios.get(baseUrl + '/dossier/slug/projects?&fields=_id,title,slug,description,image');
    const posts = await axios.get(baseUrl + '/dossier/slug/projects/posts?' + query);

    page.project = project.data;
    page.posts = posts.data;
  } catch (error) {
    page.project = null;
    page.posts = null;
  }

  res.render('index', { 
    page: page
  });
});

/* Get Blog post */
router.get('/blog/:slug', async (req, res, next) => {
  let slug = req.params.slug;

  var page = {
    render: 'post',
    name: 'post',
    project: {
      slug: slug
    },
    metadata: {
      title: 'Post Name | Torterra',
      description: 'page description',
      image: 'image-placeholder',
      url: process.env.BASE_URL + "/blog/" + slug
    }
  };

  
  try {
    const resData = await axios.get(baseUrl + '/post/slug/' + slug + '?populate=dossier');

    page.post = resData.data;
    
    page.metadata.title = page.post.title + ' - Torterra';
    page.metadata.description = page.post.description;
    page.metadata.image = page.post.featureImage;

  } catch (err) {
    page.post = null;
  }

  res.render('index', { 
    page: page
  });
});

/* Get Projects post */
router.get('/projects/:slug', async (req, res, next) => {
  let slug = req.params.slug;

  var page = {
    render: 'post',
    name: 'post',
    project: {
      slug: slug
    },
    metadata: {
      title: 'Post Name | Torterra',
      description: 'page description',
      image: 'image-placeholder',
      url: process.env.BASE_URL + "/blog/" + slug
    }
  };
  
  try {
    const resData = await axios.get(baseUrl + '/post/slug/' + slug + '?populate=dossier');
    page.post = resData.data;
    
    page.metadata.title = page.post.title + ' - Torterra';
    page.metadata.description = page.post.description;
    page.metadata.image = page.post.featureImage;

  } catch (err) {
    page.post = null;
  }
  
  res.render('index', { 
    page: page
  });
});


module.exports = router;
