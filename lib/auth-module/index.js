const Hoek = require('hoek');
const path = require('path');

const internals = {
    defaults: {

    }
};

exports.register = (server, options, next) => {
    const settings = Hoek.applyToDefaults(internals.defaults, options);

    server
        .register([
            require('hapi-auth-basic'),
            require('hapi-auth-local')
        ])
        .then(() => {
            server.auth.strategy('http-basic', 'basic', { validateFunc: require('./lib/test-password-validator') });
            server.auth.strategy('http-post', 'local', {
                usernameField: 'email',
                passwordField: 'password',
                validateFunc: require('./lib/test-password-validator')
            });

            return next();
        })
        .catch(error => {
            return next(error);
        });
};

exports.register.attributes = {
    pkg: require('./package.json'),
    // connections: false,
    once: true
};
