const express = require("express");
const compress = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const logger = require("../api/utils/logger")(__filename);
const { logs, databaseURL, env, port } = require("../constants");

const routes = require("../api/routes/v1");
const error = require("../api/middlewares/error");

module.exports = function () {
  const app = express();

  const create = () => {
    /**
		 * App General Configurations
		 */

    // request logging. dev: console | production: file
    app.use(morgan(logs));

    // This middleware take care of the origin when the origin is undefined.
    // origin is undefined when request is local
    // app.use((req, _, next) => {
    // 	req.headers.origin = req.headers.origin || req.headers.host;
    // 	next();
    // });

    // CORS configuration
    app.use(cors());
    
    // parse body params and attache them to req.body
    // app.use(express.json());
    // Body limit is 10
    // Preventing DOS Attacks
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true }));

    // gzip compression
    app.use(compress());

    // secure apps by setting various HTTP headers
    app.use(helmet());

    // Preventing DOS Attacks
    const limit = rateLimit({
      max: 100,// max requests
      windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout 
      message: 'Too many requests' // message to send
    });

    /**
		 * App Configurations: Router
		 */
    app.use("/api/v1", routes, limit);
    app.use("/", (req, res, next) => {
      res.status(200).json({
        message: "OK",
        timestamp: new Date().toISOString(),
        api: {
          v1: "/api/v1/status"
        }
      });
    })


    /**
		 * App Configurations: Error handler
		 */

    // if error is not an instanceOf APIError, convert it.
    app.use(error.converter);
    // catch 404 and forward to error handler
    app.use(error.notFound);
    // error handler, send stacktrace only during development
    app.use(error.handler);

    /**
		 * Connect the database
		 */

    const connect = () => mongoose.connect(databaseURL, {
      useNewUrlParser: true,
      useCreateIndex: true
    });
    connect();

    mongoose.connection.on('error', () => { 
			return logger.error('Couldn´t connect to database!', err);
		})

		mongoose.connection.on('disconnected', () => {
			return logger.info('Mongoose default connection is disconnected!');
		})

		mongoose.connection.on('connected', () => {
			return logger.info(`Mongoose connected [databaseURL] = [${databaseURL}]`);
		})
  };

  const start = () => {
    // listen to requests
    app.listen(port, (err) => {
      if (err)
        return logger.error("server failed to start", err);

      return logger.info(`server started [env, port] = [${env}, ${port}]`);
    });
  };

  return {
    create: create,
    start: start
  };
};
