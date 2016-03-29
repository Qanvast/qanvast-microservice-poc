"use strict";

const _ = require('lodash');
const hapi = require('hapi');

const server = new hapi.Server();

server
    .connection({
        host: 'localhost',
        port: 9000
    });

// server
//     .connection({
//         host: 'localhost',
//         port: 9001
//     });

// Register all the necessary plugins and then start the server.
const plugins = [
    {
        register: require('good'),
        options: {
            // TODO: Update for good v7.x.x
            //includes: {
            //    request: ['headers', 'payload'],
            //    response: ['payload']
            //},
            //ops: {
            //    intervals: 30000
            //},
            //reporters: {
            //    'ops-console': [
            //        {
            //            // Equivalent to calling `new require('good-squeeze').Squeeze([{ ops: '*' }, { request: '*' }, { response: '*' }])`
            //            module: 'good-squeeze',
            //            name: 'Squeeze',
            //            args: [{ log: '*' }, { ops: '*' }]
            //        },
            //        {
            //            // Equivalent to calling `new require('good-squeeze').SafeJson()`
            //            module: 'good-squeeze',
            //            name: 'SafeJson'
            //        },
            //        {
            //            // Equivalent to calling `new require('good-console')()`;
            //            module: 'good-console'
            //        }
            //    ],
            //    'all-http': [
            //        {
            //            // Equivalent to calling `new require('good-squeeze').Squeeze([{ ops: '*' }, { request: '*' }, { response: '*' }])`
            //            module: 'good-squeeze',
            //            name: 'Squeeze',
            //            args: [{ error: '*' }, { log: '*' }, { ops: '*' }, { request: '*' }, { response: '*' }]
            //        },
            //        {
            //            // Equivalent to calling `new require('good-squeeze').SafeJson()`
            //            module: 'good-squeeze',
            //            name: 'SafeJson'
            //        },
            //        {
            //            module: 'good-http',
            //            args: [
            //                'https://logger.qanva.st', // URL mapped locally to a logger process
            //                { wreck: headers: { 'x-api-key': 12345 } }
            //            ]
            //        }
            //    ]
            //},
            requestHeaders: true,
            requestPayload: true,
            responsePayload: true,
            opsInterval: 30000,
            reporters: [
                {
                    reporter: require('good-console'),
                    events: {
                        error: '*',
                        log: '*',
                        ops: '*'
                    }
                }, {
                    reporter: require('good-http'),
                    events: {
                        error: '*',
                        log: '*',
                        ops: '*',
                        request: '*',
                        response: '*'
                    },
                    config: {
                        endpoint: 'https://logger.qanva.st', // URL mapped locally to a logger process
                        wreck: {
                            headers: { 'x-api-key' : 12345 } // TODO Update the API key
                        }
                    }
                }
            ]
        }
    },
    {
        register: require('./lib/qanvast-api-landing')
    },
    {
        register: require('./lib/hello-world'),
        options: {
            msg: `SUNSHINE! HELLO!`
        }
    }
];

server
    .register(plugins)
    .then(() => server.start())
    .catch(error => {
        console.error(`========================================\nUnable to start server!\n========================================`);
        console.error(error);

        process.exit(1);
    })
    .then(() => {
        _.forEach(server.connections, connection => {
            console.log(`========================================\nServer Running at ${connection.info.uri}.\n========================================`);
        });
    });


