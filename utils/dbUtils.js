'use strict';

const pg = require('pg');
const conString = "postgres://postgres:xxx@localhost:5432/wedding";
let client = null;


class dbUtils{

    updateByEmail(email, payload){
        return new Promise(function(resolve, reject){
            client = new pg.Client(conString);
            client.connect();
            let query = null;
            const currDate = new Date();
            let queryString = '';
            let queryArr = null;

            if (payload.readOnly === false) {
                queryString = `update wedding_list 
                set firstname = $1, 
                lastname = $2,
                attending = $3,
                dateupdate = $4
                where email = $5 and firstname is null and lastname is null`;
                queryArr =  [payload.firstName || null, payload.lastName || null, payload.attending, currDate, email || ''];
            }
            else{

                queryString = `update wedding_list
                set attending = $1,
                dateupdate = $2
                where email = $3 and firstname = $4 and lastname = $5`;
                queryArr = [payload.attending, currDate, email || '', payload.firstName || '', payload.lastName || ''];
            }
            client.query(queryString, queryArr, function(err, result){
              resolve(result.rowCount);
            });






        });
    }

    getByEmail(email){
        return new Promise(function(resolve, reject){
            client = new pg.Client(conString);
            client.connect();

            let query = client.query('select firstname, lastname, email, attending  from wedding_list where email =  $1 order by id, length(lastname)', [email]);
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