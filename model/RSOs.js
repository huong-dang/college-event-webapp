const db = require('../db');

exports.getAllStudentsFromUniversity = (university, callback) => {
    if (!university)
        callback({ errorMessage: `Must provide a university name!` });
    else {
        const query = `select * from Users u where u.university = '${university}'`;
        db.get().query(query, (err, results) => {
            if (err) callback(err);
            else {
                callback(null, results);
            }
        });
    }
};

exports.getAllRSOsFromUni = (university, callback) => {
    if (!university)
        callback({ errorMessage: `Must provide a university name!` });
    else {
        const query = `select * from RSOs r where r.university = '${university}'`;

        db.get().query(query, (err, results) => {
            if (err) callback(err);
            else {
                callback(null, results);
            }
        });
    }
};

exports.createRSO = (rsoInfo, callback) => {};
