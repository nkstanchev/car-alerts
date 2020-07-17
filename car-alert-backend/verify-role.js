/*
 * Copyright (c) 2015-2017 IPT-Intellectual Products & Technologies (IPT).
 * All rights reserved.
 *
 * This file is licensed under terms of GNU GENERAL PUBLIC LICENSE Version 3
 * (GPL v3). The full text of GPL v3 license is providded in file named LICENSE,
 * residing in the root folder of this project.
 *
 */

const mongodb = require('mongodb');

module.exports = function verifyRoleOrSelfAlert(role) {
  return function (req, res, next) {
    const paramAlertId = req.params.id;
    const userId = req.user.id;
    const db = req.app.locals.db;
    console.log('db', db);
    console.log('paramAlertId', paramAlertId);
    console.log('userId', userId);
    if (!userId || !paramAlertId ) next({ status: 403, message: `No userId provided.` }); //Error
    else {
      db.collection('alerts').findOne({ _id: new mongodb.ObjectID(paramAlertId) }, function (error, alert) {
        if (error) next({ status: 500, message: `Server error.`, error }); //Error
        else if (!alert)  next({ status: 404, message: `Alert not found.` }); //Error
        else {
            if (req.user.role == role || alert.user_id == userId) {
                // if everything good, save user to request for use in other routes
                req.alert = alert;
                next();
            }
            else {
              next({ status: 403, message: `Not enough privilegies for this operation.` });} //Error
        }
      });
    }
  }
}