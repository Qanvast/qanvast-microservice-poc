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
        register: require('./lib/auth-module'),
        routes: {
            prefix: '/authentication'
        },
        options: {

        }
    },
    {
        register: require('./lib/api-landing-module')
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
        console.error(`Unable to start server!\n========================================`);
        console.error(error);

        process.exit(1);
    })
    .then(() => {
        console.info(`====================================================================================================\n\n\n   ______           ___      .__   __. ____    ____  ___           _______.___________.\n  \/  __  \\         \/   \\     |  \\ |  | \\   \\  \/   \/ \/   \\         \/       |           |\n |  |  |  |       \/  ^  \\    |   \\|  |  \\   \\\/   \/ \/  ^  \\       |   (----\`---|  |----\`\n |  |  |  |      \/  \/_\\  \\   |  . \`  |   \\      \/ \/  \/_\\  \\       \\   \\       |  |     \n |  \`--\'  \'--.  \/  _____  \\  |  |\\   |    \\    \/ \/  _____  \\  .----)   |      |  |     \n  \\_____\\_____\\\/__\/     \\__\\ |__| \\__|     \\__\/ \/__\/     \\__\\ |_______\/       |__|\n\n ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~\n  _   _ ___ ____   ____  _   _ _   _ _____   ____  ____      _    ____ ___  _   _ _____ ____\n | | | |_ _\/ ___| \/ ___|| | | | \\ | |_   _| |  _ \\|  _ \\    \/ \\  \/ ___\/ _ \\| \\ | | ____\/ ___|\n | |_| || | |     \\___ \\| | | |  \\| | | |   | | | | |_) |  \/ _ \\| |  | | | |  \\| |  _| \\___ \\\n |  _  || | |___   ___) | |_| | |\\  | | |   | |_| |  _ <  \/ ___ \\ |__| |_| | |\\  | |___ ___) |\n |_| |_|___\\____| |____\/ \\___\/|_| \\_| |_|   |____\/|_| \\_\\\/_\/   \\_\\____\\___\/|_| \\_|_____|____\/\n\n ... Here be Dragons ...\n\n All rights reserved. All your base are belong to us.\n\n\n====================================================================================================\n`);
        _.forEach(server.connections, connection => {
            console.log(`========================================\nServer Running at ${connection.info.uri}.\n========================================`);
        });
    });


