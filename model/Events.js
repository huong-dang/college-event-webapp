const db = require('../db');
const async = require('async');
const Users = require('./Users');
const RSOs = require('./RSOs');

// const {
//   event_name,
//   event_location,
//   event_time,
//   event_description,
//   event_id,
//   admin_id,
//   admin_email,
//   event_comment,
// } = props.eventInfo;
exports.getAllPublicEvents = callback => {
    const query = `select * 
    from Events e, Public_events p, Locations l, Admins a, Users u
    where e.event_id=p.public_event_id and l.location_id=e.event_location and p.admin_id = a.admin_id and a.admin_id = u.uid;`;

    db.get().query(query, (err, results) => {
        if (err) callback(err);
        else {
            callback(null, results);
        }
    });
};

exports.getAllPrivateEvents = (university, callback) => {
    if (!university) callback(`No university provided!`);
    else {
        const query = `select * from Private_events p, Events e, Locations l, Admins a, Users u
    where l.university = '${university}' and
      e.event_id=p.private_event_id and
      l.location_id = e.event_location and
      p.admin_id = a.admin_id and
      a.admin_id = u.uid;`;

        db.get().query(query, (err, results) => {
            if (err) callback(err);
            else {
                callback(null, results);
            }
        });
    }
};

exports.getAllStudentRSOEvents = (uid, callback) => {
    if (!uid) callback(`No uid provided!`);
    else {
        const query = `select * from RSO_events r_event, Users u, RSO_membership mem, Events e, Admins a, Locations l, RSOs r
            where u.uid='${uid}' and
            mem.student_id=u.uid and
            r_event.rso_id = mem.rso_id and
            l.location_id=e.event_location and
            r_event.rso_event_id=e.event_id and
            r_event.admin_id=a.admin_id and
            r.rso_id = r_event.rso_id`;

        db.get().query(query, (err, results) => {
            if (err) callback(err);
            else {
                callback(null, results);
            }
        })
    }
};
