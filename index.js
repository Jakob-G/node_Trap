/**
 * ToDo: Package data from other requests and send to DB, need to set up promises for data
 */

const exp = require("express");
const port = process.env.PORT || 8008;
const path = require("path");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const session = require("client-sessions");

// had to change button Id of second add button for the other request option

//defining routed function files -Homy


var pF = path.resolve(__dirname, "public");
var app = exp();

//create a new server for socket, but combine it with express functions
const server = require("http").createServer(app);

app.use(session({
    cookieName: 'session',
    secret: "something",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

const sessionCheck = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(expressSession({
    secret: "HIGJLCPJOPUD",
    resave: true,
    saveUninitialized: true
}));

app.use("/scripts", exp.static("build"));
app.use("/css", exp.static("style"));
app.use("/pages", exp.static("public"));
app.use("/dependencies", exp.static("src"))

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, resp) {
    resp.sendFile(pF + "/home.html")
});

app.get("/login", function (req, resp) {
    resp.sendFile(pF + "/login.html")
});

app.get("/building", function (req, resp) {
    resp.sendFile(pF + "/building.html")
});
app.get("/floor", function (req, resp) {
    resp.sendFile(pF + "/floor.html")
});
app.get("/trap", function (req, resp) {
    resp.sendFile(pF + "/trap.html")
});
app.post("/floor", function(req, resp){
    resp.render(pF+"/floor.hbs",{
        b_id: req.body.b_id,
        f_id: req.body.f_id,
    })
});
app.post("/trap", function(req, resp){
    console.log(req.body)
    resp.render(pF+"/trap.hbs",{
        b_id: req.body.b_id,
        f_id: req.body.f_id,
    })
});

server.listen(8008, function (err) {
    if (err) {
        console.log(err);
        return false;
    }

    console.log(port + " is running");
});


/*app.get("/menu", function(req, resp){
    resp.sendFile(pF+"/menu.html")
});
*/


