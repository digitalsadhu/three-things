var loopback = require('loopback');
var boot = require('loopback-boot');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('express-flash');

var app = module.exports = loopback();

var PassportConfigurator = require('loopback-component-passport').PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(loopback.context());

// The access token is only available after boot
app.use(loopback.token({
  model: app.models.AccessToken,
  currentUserLiteral: 'me'
}));

app.use(function setCurrentUser(req, res, next) {
  if (!req.accessToken) {
    return next();
  }
  app.models.user.findById(req.accessToken.userId, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('No user with this access token was found.'));
    }
    var loopbackContext = loopback.getCurrentContext();
    if (loopbackContext) {
      loopbackContext.set('currentUser', user);
    }
    next();
  });
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // to support JSON-encoded bodies
  app.middleware('parse', bodyParser.json());
  // to support URL-encoded bodies
  app.middleware('parse', bodyParser.urlencoded({
    extended: true
  }));

  app.middleware('session:before', loopback.cookieParser(app.get('cookieSecret')));
  app.middleware('session', loopback.session({
    secret: 'kitty',
    saveUninitialized: true,
    resave: true
  }));

  var config = require('./providers.js');

  // Initialize passport
  passportConfigurator.init();

  // We need flash messages to see passport errors
  app.use(flash());

  // Set up related models
  passportConfigurator.setupModels({
    userModel: app.models.user,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.userCredential
  });
  // Configure passport strategies for third party auth providers
  for(var providerName in config) {
    var providerData = config[providerName];
    providerData.session = providerData.session !== false;
    passportConfigurator.configureProvider(providerName, providerData);
  }

  var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

  app.get('/auth/account', ensureLoggedIn('/login'), function (req, res, next) {
    res.render('pages/loginProfiles', {
      user: req.user,
      url: req.url
    });
  });

  app.get('/link/account', ensureLoggedIn('/login'), function (req, res, next) {
    res.render('pages/linkedAccounts', {
      user: req.user,
      url: req.url
    });
  });

  app.get('/local', function (req, res, next){
    res.render('pages/local', {
      user: req.user,
      url: req.url
    });
  });

  app.get('/signup', function (req, res, next){
    res.render('pages/signup', {
      user: req.user,
      url: req.url
    });
  });

  app.post('/signup', function (req, res, next) {

    var User = app.models.user;

    var newUser = {};
    newUser.email = req.body.email.toLowerCase();
    newUser.username = req.body.username.trim();
    newUser.password = req.body.password;

    User.create(newUser, function (err, user) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      } else {
        // Passport exposes a login() function on req (also aliased as logIn())
        // that can be used to establish a login session. This function is
        // primarily used when users sign up, during which req.login() can
        // be invoked to log in the newly registered user.
        req.login(user, function (err) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          return res.redirect('/auth/account');
        });
      }
    });
  });

  app.get('/login', function (req, res, next){
    res.render('pages/login', {
      user: req.user,
      url: req.url
     });
  });

  app.get('/link', function (req, res, next){
    res.render('pages/link', {
      user: req.user,
      url: req.url
    });
  });

  app.get('/auth/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
  });

  var path = require('path');
  app.use('/', ensureLoggedIn('/login'), loopback.static(path.resolve(__dirname, '../client')));

  app.get('*', ensureLoggedIn('/login'), function(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../client') + '/index.html');
  });

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
