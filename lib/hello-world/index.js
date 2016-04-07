const Hoek = require('hoek');

const internals = {
    defaults: {
        msg: `Hello World!`
    }
};

exports.register = (server, options, next) => {
    const settings = Hoek.applyToDefaults(internals.defaults, options);

    server
        .route({
            method: 'GET',
            path: '/hello-world',
            config: { auth: 'http-basic' },
            handler: (request, reply) => {
                reply(settings.msg);
            }
        });

    return next();
};

exports.register.attributes = {
    pkg: require('./package.json'),
    // connections: false,
    dependencies: ['auth-module'],
    once: true
};

