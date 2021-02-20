const express = require('express');
const path = require('path');
const helmet = require('helmet')

const app = express();

app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/torterra-dashboard'));

app.get('*', function(req,res) {
  res.sendFile(path.join(__dirname + '/dist/torterra-dashboard/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
