const express = require('express');
const cors  = require('cors');
const db = require('./db'); //import the database connestion

const app = express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res) => {
    res.send("Server is running!");
});

app.get('/read-task',(req,res) => {
    const q = 'select * from todos';
    db.query(q,(err,result) => {
        if(err) {
            console.log("failed to read tasks");
        }else {
            console.log("got tasks successfully from db");
            res.send(result);
        }
    })

});

app.get('/read-task/:id',(req,res) => {
    const taskId =  req.params.id;  // Get the ID from the URL parameters
    const q = "select * from todos where id = ?";
    db.query(q,[taskId],(err,result) => {
        if (err) {
            console.log("failed to read tasks");
            res.status(500).send("Error while retrivering the task");
        } else{
            if(result.length > 0) {
                console.log("Task retrived successufully");
                res.send(result);
            }else{
                res.status(400).send("Task not found");
            }
        }
    })
});


app.post('/new-task',(req,res)=>{
    console.log(req.body);

    const q = "insert into todos (task,createdAt, status) values(?,?,?)";
    db.query(q,[req.body.task, new Date(), 'active'], (err,result) => {
        if(err) {
            console.log('Failed to save task');
            res.status(500).send("Error saving task");
        }else{
            console.log("Task saved successfully");
            const updatedTasks = 'select * from todos'
            db.query(updatedTasks, (error,newList) => {
                res.send(newList);
            })
        }
    })
});

app.post('/update-task',(req,res)=>{
    console.log(req.body);
    const q = "update todos set task = ? where id = ?";
    db.query(q,[req.body.task,req.body.updatedId], (err,result) => {
        if(err) {
            console.log('failed to update');
        }else{
            console.log('updated');
            db.query('select * from todos', (e,r) => {
                if(e) {
                    console.log(e);
                }else{
                    res.send(r);
                }
            })
        }
    })
})


app.post("/delete-task",(req,res) => {
    const q = "delete from todos where id = ?";
    db.query(q,[req.body.id],(err,result) => {
        if(err){
            console.log("failed to delete");
        }else{
            console.log("Deleted successfully");
            db.query("select * from todos",(e,newList) => {
                if(e) {
                    console.log(e)
                }else{
                    res.send(newList);
                }
            })
        }
    })
})

app.post('/complete-task',(req,res) => {
    console.log(req.body);

    // Ensure the request body contains a valid task ID
    if (!req.body.id) {
        return res.status(400).send('Task ID is required');
    }

    const q = "update todos set status = ? where id = ?";
    db.query(q,['completed', req.body.id],(err,result) => {
        if(err){
            console.error('Failed to mark task as completed:', err);
            return res.status(500).send('Error updating task');
        }
        console.log("task marked as completed");
         // Fetch updated list of tasks after marking as completed
         db.query("select * from todos",(e,newList) => {
            if (e) {
                console.error('Failed to fetch updated task list:', e);
                return res.status(500).send('Error fetching tasks');
            }else {
                res.send(newList);
            }
         })
    })
})




const PORT = process.env.PORT || 3300

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

