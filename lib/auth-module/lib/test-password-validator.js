const Bcrypt = require('bcrypt');

// TEST
const users = new Map([
    [
        'steve.tan@qanvast.com', {
            id: 1,
            email: 'steve.tan@qanvast.com',
            name: 'Steve Tan',
            password: Bcrypt.hashSync('P@ssw0rd123', 10)
        }
    ],
    [
        'testuser@qanvast.com', {
            id: 2,
            email: 'testuser@qanvast.com',
            name: 'Test User',
            password: Bcrypt.hashSync('P@ssw0rd123', 10)
        }
    ]
]);

module.exports = (request, username, password, callback) => {
    const user = users.get(username);

    if (user == null) {
        return callback(null, false);
    }

    Bcrypt.compare(password, user.password, (error, isValid) => {
        callback(error, isValid, { id: user.id, name: user.name });
    });
};
