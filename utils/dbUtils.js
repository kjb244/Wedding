'use strict';

const pg = require('pg');
const conStringLocal = "postgres://postgres:sdf!@localhost:5432/wedding";
let conString = process.env.DATABASE_URL || conStringLocal;
conString = conString.replace('postgres://','');
let config = {
    user: conString.split('/')[0].split(':')[0],
    database: conString.split('/')[1],
    password: conString.split('/')[0].split(':')[1].split('@')[0],
    host: conString.split('@')[1].split(':')[0],
    port: 5432,
    max: 10,
    idleTimeoutMillis: 3000
};



class dbUtils{


    updateByEmail(email, payload){
        email = (email || '').toLowerCase();
        return new Promise(function(resolve, reject){
            console.log(`updating db for email: ${email} with payload: ${JSON.stringify(payload)}`);

            let query = null;
            const currDate = new Date();
            let queryString = '';
            let queryArr = null;

            if (payload.readOnly === false) {
                queryString = `update wedding_list 
                set firstname = $1, 
                lastname = $2,
                attending = $3,
                dietaryrestrictions = $4,
                dateupdate = $5
                where lower(email) = $6 and firstname is null and lastname is null`;
                queryArr =  [payload.firstName || null,
                    payload.lastName || null,
                    payload.attending,
                    payload.dietaryRestrictions || null,
                    currDate,
                    email || ''];
            }
            else{

                queryString = `update wedding_list
                set attending = $1,
                dietaryrestrictions = $2,
                dateupdate = $3
                where lower(email) = $4 and firstname = $5 and lastname = $6`;
                queryArr = [payload.attending,
                    payload.attending == true ? (payload.dietaryRestrictions || null) : null,
                    currDate,
                    email || '',
                    payload.firstName || '',
                    payload.lastName || ''];
            }


            console.log(`before running update query: ${queryString} ${queryArr}`);

            let pool = new pg.Pool(config);
            pool.connect(function (err, client, done) {


                client.query(queryString, queryArr, function (err, res) {
                    done();
                    if (err) {
                        console.log(`email lookup db call failed for: ${email}`);
                        reject();
                    }
                    else{
                        resolve(res.rowCount);
                    }

                });
            });

        });
    }

    getByEmail(email){
        email = (email || '').toLowerCase();
        return new Promise(function(resolve, reject) {
            console.log(`making email call from db`);
            let pool = new pg.Pool(config);
            pool.connect(function (err, client, done) {


                client.query('select firstname, lastname, email, attending, dietaryrestrictions, dateupdate  from wedding_list where lower(email) =  $1 order by id, length(lastname)', [email], function (err, res) {
                    done();
                    if (err) {
                        console.log(`email lookup db call failed for: ${email}`);
                        reject();
                    } else {
                        const rows = res.rows;
                        const arr = [];
                        rows.map(function (row) {
                            arr.push(
                                {
                                    firstName: row.firstname,
                                    lastName: row.lastname,
                                    email: row.email,
                                    attending: row.attending || false,
                                    dietaryRestrictions: row.dietaryrestrictions,
                                    dateUpdate: row.dateupdate
                                }
                            );
                        });
                        console.log(`email retrieved successfully from db`);
                        resolve(arr);
                    }
                });
            });
        })


    }

}


const dbUtilObj = new dbUtils();

module.exports = dbUtilObj;