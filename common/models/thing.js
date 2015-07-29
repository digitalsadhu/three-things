var loopback = require('loopback');

module.exports = function(Thing) {

  Thing.observe('before save', function addUser(ctx, next) {
    if (ctx.isNewInstance) {
      var user = loopback.getCurrentContext().get('currentUser');

      if (!user) next(new Error('Please login to create a thing'));

      ctx.instance.userId = user.id;
    }
    next();
  });

  Thing.observe('before save', function addTimestampMetadata(ctx, next) {
    if (ctx.isNewInstance)
      ctx.instance.createdAt = ctx.instance.updatedAt = new Date();

    if (ctx.currentInstance) ctx.currentInstance.updatedAt = new Date();

    next();
  });
};
