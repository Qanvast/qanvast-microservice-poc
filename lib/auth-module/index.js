const Boom = require('boom');
const Hoek = require('hoek');
const path = require('path');

const internals = {
    defaults: {
        authentication: {
            local: {
                usernameField: 'username',
                passwordField: 'password'
            }
        }
    }
};

exports.register = (server, options, next) => {
    const settings = Hoek.applyToDefaults(internals.defaults, options);

    // Auth module should support cookie, basic and bearer (JWT) authentication method.
    server
        .register([
            require('hapi-auth-basic'),
            require('hapi-auth-cookie')
            // require('hapi-auth-bearer-jwt')
        ])
        .then(() => {
            // Setup HTTP Basic Authentication method
            server.auth.strategy('http-basic', 'basic', {
                validateFunc: require('./lib/test-password-validator')
            });


            // Setup routes for authentication
            server
                .route({
                    method: 'POST',
                    path: '/connect/local',
                    handler: (request, reply) => {
                        const username = request.payload[settings.authentication.local.usernameField];
                        const password = request.payload[settings.authentication.local.passwordField];

                        if (!username || !password) {
                            return reply(Boom.unauthorized('Authentication request missing credentials'));
                        }

                        require('./lib/test-password-validator')(request, username, password, (error, isValid, credentials) => {

                            credentials = credentials || null;

                            if (error) {
                                // Throw up the error!
                                return reply(error);
                            }

                            if (!isValid) {
                                return reply(Boom.unauthorized('Bad username or password'));
                            }

                            if (!credentials || typeof credentials !== 'object') {
                                // Server Error, similar to our WTF error.
                                return reply(Boom.badImplementation('Bad credentials object received for Local auth validation'));
                            }

                            // Authenticated
                            return reply({
                                user: credentials,
                                tokens: {
                                    // TODO
                                }
                            });
                        });
                    }
                });

            server
                .route({
                    method: 'POST',
                    path: '/connect/facebook-token',
                    handler: (request, reply) => {
                        return reply(Boom.badImplementation('Not yet implemented'));
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
