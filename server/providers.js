module.exports = {
  local: {
    provider: 'local',
    module: 'passport-local',
    usernameField: 'username',
    passwordField: 'password',
    authPath: '/auth/local',
    successRedirect: '/auth/account',
    failureRedirect: '/local',
    failureFlash: true
  },
  facebookLogin: {
    provider: 'facebook',
    module: 'passport-facebook',
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
    authPath: '/auth/facebook',
    callbackPath: '/auth/facebook/callback',
    successRedirect: '/auth/account',
    failureRedirect: '/login',
    scope: ['email'],
    failureFlash: true
  },
  facebookLink: {
    provider: 'facebook',
    module: 'passport-facebook',
    clientID: '536578806401351',
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    authPath: '/link/facebook',
    callbackPath: '/link/facebook/callback',
    successRedirect: '/auth/account',
    scope: ['email']
  },
  googleLogin: {
    provider: 'google',
    module: 'passport-google-oauth',
    strategy: 'OAuth2Strategy',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    authPath: '/auth/google',
    callbackPath: '/auth/google/callback',
    successRedirect: '/auth/account',
    failureRedirect: '/login',
    scope: ['email', 'profile'],
    failureFlash: true
  },
  googleLink: {
    provider: 'google',
    module: 'passport-google-oauth',
    strategy: 'OAuth2Strategy',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/link/google/callback',
    authPath: '/link/google',
    callbackPath: '/link/google/callback',
    successRedirect: '/auth/account',
    failureRedirect: '/login',
    scope: ['email', 'profile'],
    link: true,
    failureFlash: true
  }
}
