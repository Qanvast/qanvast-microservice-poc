const Hoek = require('hoek');
const path = require('path');

const internals = {
    defaults: {
        etagsCacheMaxSize: 32,
        directory: {
            path: path.join(__dirname, 'public'),
            index: true,
            listing: false
        }
    }
};

exports.register = (server, options, next) => {
    const settings = Hoek.applyToDefaults(internals.defaults, options);

    server
        .register({
            register: require('inert'),
            options: {
                etagsCacheMaxSize: settings.etagsCacheMaxSize // We don't need a lot of space for cache
            }
        }, {
            once: true
        })
        .then(() => {
            server
                .route({
                    method: 'GET',
                    path: '/{param*}',
                    handler: {
                        directory: settings.directory
                    }
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
