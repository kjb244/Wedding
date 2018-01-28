'use strict';

const pg = require('pg');
const conString = "postgres://postgres:xyz@localhost:5432/wedding";
let client = null;


class dbUtils{



    getByEmail(email){
        return new Promise(function(resolve, reject){
            client = new pg.Client(conString);
            client.connect();

            let query = client.query('select firstname, lastname, email, attending  from wedding_list where email =  $1', [email]);
            let arr = [];
            query.on('error', function(err){
                reject();
            });
            query.on('row', function(row){
                arr.push(
                {firstName: row.firstname,
                lastName: row.lastname,
                email: row.email,
                attending: row.attending || false}
                );
            });

            query.on('end', function(result){
                client.end();
                resolve(arr);
            })
        })


    }

}


const dbUtilObj = new dbUtils();

module.exports = dbUtilObj;