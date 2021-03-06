/*
* Database queries for the repair order page
*/

var express = require('express');
var router = express.Router();
const pg = require('pg');

const config = {
    user: 'postgres',
    database: 'trap',
    password: 'password',
    port: 5432
};

const pool = new pg.Pool(config);

// query database based on user search parameters
router.post("/AroSearch", function (req,resp){
    
    var roSearchWord = req.body.roSearchWord;
    var searchBy = req.body.roSearchBy;
    var roStatus = req.body.roStatus;
        
    
    pool.connect(function (err, client, done){
        if (err) {
            console.log("Unable to connect to the database: " + err );
        }
        else{
            console.log("Successfully login to database!")
            client.query(roQuery, data, function(err, result){
                done();
                if(err){
                    console.log(err.message);
                    resp.send(null);
                }
                else{
                    resp.send(result.rows);

                }
            })
        }
        
        
    })
});


// search for task information using the repair order ID (ro_id)
router.post("/taskSearch", function (req,resp){
    
    var roID = req.body.roID;
    
    var data = [roID];
    
    var taskQuery = 'SELECT task_name, comments, worktask_id FROM repair_tasks rt INNER JOIN task t ON rt.task_id = t.task_id WHERE ro_id = $1';
    
    pool.connect(function (err, client, done){
        if (err) {
            console.log("(taskSearch - Unable to connect to the database: " + err );
        }
        else{
            client.query(taskQuery, data, function(err, result){
                done();
                if(err){
                    console.log(err.message);
                    resp.send(null);
                }
                else{
                    resp.send(result.rows);
                }
            })
        }
        
        
    })
});

router.post("/PartSearch", function (req,resp){
    
    var ID = req.body.id;
    
    console.log(ID);
    
    var data = [ID];
    
    var taskQuery = 'SELECT * FROM parts WHERE worktask_id = $1';
    
    pool.connect(function (err, client, done){
        if (err) {
            console.log("(PartsSearch - Unable to connect to the database: " + err );
        }
        else{
            client.query(taskQuery, data, function(err, result){
                done();
                if(err){
                    console.log(err.message);
                    resp.send(null);
                }
                else{
                    console.log(result.rows);
                    resp.send(result.rows);
                }
            })
        }
        
        
    })
});

router.post("/LabourSearch", function (req,resp){
    
    var ID = req.body.id;
    
    var data = [ID];
    
    var taskQuery = 'SELECT * FROM labour WHERE worktask_id = $1';
    
    pool.connect(function (err, client, done){
        if (err) {
            console.log("(LabourSearch - Unable to connect to the database: " + err );
        }
        else{
            client.query(taskQuery, data, function(err, result){
                done();
                if(err){
                    console.log(err.message);
                    resp.send(null);
                }
                else{
                    resp.send(result.rows);
                }
            })
        }
        
        
    })
});

// this function is neccessary to update the task comments correctly 
async function updateTaskCommentsLoop(arraytaskIDComments){
    
    for(var i = 0; i<arraytaskIDComments.length; i++){
        var taskcomments = await arraytaskIDComments[i].comments;
        var taskid = await arraytaskIDComments[i].worktask_id;
        const varr = await connectDBTaskComments(taskid, taskcomments).then().catch(err => console.log(err));
        if(i == (arraytaskIDComments.length-1)){
            return;
        }
    }
}

// this function connects to the database and update the comments in the repair_tasks table 
var connectDBTaskComments = (worktask_id, comments) => {
    
    return new Promise((resolve, reject) => {
           pool.connect(function (err, client, done){
               
                if (err) {
                    console.log("(updateRO - Unable to connect to the database: " + err );
                    reject(err);
                }
                else{
                    var commentsData = [comments, worktask_id];
                    var updateQuery = 'UPDATE repair_tasks SET comments = $1 WHERE worktask_id = $2';

                    client.query(updateQuery, commentsData, function(err, result){
                        done();
                        if(err){
                            console.log("updateRO failed");
                            reject(err);

                        }
                        else{
                            resolve("updateRO successful");
                        }
                    });
                }


            });            
    });
    
}

// this function update the odometer out and repair order status 
router.post("/updateRO", function (req,resp){
    var arraytaskIDComments = req.body.worktaskIDComments;
    
    updateTaskCommentsLoop(arraytaskIDComments)
        .then(
            //Do everything here if you want to do it after the comments are added to the database
        )
        .catch(err => console.log(err));
    
    if(req.body.odometerOut == ""){
        var odometerOut = null;
    }else{
        var odometerOut = req.body.odometerOut;
    }
    
    var openClose = req.body.openClose;
    
    var roID = req.body.roID;
    if(odometerOut == 'null'){
        odometerOut = null;
    }
    var odometerOutData = [odometerOut, roID];
    var updateOdoQuery = 'UPDATE repair_order SET odometer_out = $1 WHERE ro_id = $2';
    
    var opencloseData = [openClose, roID];
    var updateroStatus = 'UPDATE repair_order SET status = $1 WHERE ro_id = $2';
    
    pool.connect(function (err, client, done){
            if (err) {
                console.log("(updateOdoRO - Unable to connect to the database: " + err );
            }
            else{
                console.log("updateOdoRO - Successfully login to database!")
            }

            client.query(updateOdoQuery, odometerOutData, function(err, result){
                if(err){
                    console.log(err);
                    
                }
                else{
                    client.query(updateroStatus, opencloseData, function(err, result){
                        done();
                        if(err){
                            console.log("updateROStatus failed");

                        }
                        else{
                            console.log("Updated Repair Order status");
                            resp.send('Updated Repair Order status');
                        }
                    });
                }
            })
        })
    
});

router.post("/updateParts", function (req,resp){
    var temp = []
    
    temp.push(req.body.row[0])
    temp.push(req.body.row[1])
    temp.push(req.body.row[2])
    temp.push(parseFloat(req.body.row[3]))
    temp.push(parseFloat(req.body.row[4]))
    temp.push(parseInt(req.body.row[5]))
    
    
    if(req.body.type == "new"){
        temp.push(parseInt(req.body.id))
        var updateOdoQuery = 'INSERT INTO parts (part_no, part_desc, qty, unit_price, sell_price, supplier_name, worktask_id) VALUES ($1,$2,$5,$4,$6,$3,$7)';
    }
    else{
        temp.push(parseInt(req.body.type))
        var updateOdoQuery = 'Update parts Set part_no = $1, part_desc = $2, qty=$5, unit_price=$4, sell_price=$6, supplier_name=$3 where part_id = $7';
    }
    pool.connect(function (err, client, done){
            if (err) {
                console.log("(updateParts - Unable to connect to the database: " + err );
            }
            else{
                console.log("updateParts - Successfully login to database!")
            }

            client.query(updateOdoQuery, temp, function(err, result){
                if(err){
                    console.log(err);
                    
                }
                else{
                    console.log("Updated Parts");
                    resp.send('Updated Parts');
                }
            })
        })
    
});

router.post("/updateLabour", function (req,resp){
    var temp = []
    
    temp.push(parseFloat(req.body.row[0]))
    temp.push(req.body.row[1])
    temp.push(parseFloat(req.body.row[2]))
    temp.push(parseFloat(req.body.row[3]))
    
    if(req.body.type == "new"){
        temp.push(parseInt(req.body.id))
        var updateOdoQuery = 'INSERT INTO labour (tech_no , tech_name , hours , rate , worktask_id) VALUES ($1,$2,$3,$4,$5)';
    }
    else{
        temp.push(parseInt(req.body.type))
        var updateOdoQuery = 'Update labour Set tech_no = $1 , tech_name =$2 , hours =$3 , rate =$4 where labour_id = $5';
    }
    
    
    pool.connect(function (err, client, done){
            if (err) {
                console.log("(updateLabour - Unable to connect to the database: " + err );
            }
            else{
                console.log("updateLabour - Successfully login to database!")
            }

            client.query(updateOdoQuery, temp, function(err, result){
                if(err){
                    console.log(err);
                    
                }
                else{
                    console.log("Updated Labour");
                    resp.send('Updated Labour');
                }
            })
        })
});

module.exports = router;