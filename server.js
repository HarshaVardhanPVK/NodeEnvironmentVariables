const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.listen(process.env.PORT || 3200);
console.log('server listening at: 3200');

var routes = {};
routes.environments = require('./route/environments.js');

app.get('/getEnvironment/:process', routes.environments.getEnvironment);
app.put('/setEnvironment/:process/:key/:value', routes.environments.setEnvironment);
app.get('/getListOfProcesses', routes.environments.getListOfProcesses);
app.put('/updateProcess/:process', routes.environments.updateProcess);

const dir = 'c:node-app';
const file = '.env';
const processConfig = {
    Process1: dir + '/p1',
    Process2: dir + '/p2',
}

const environments = {
    Process1: {
        DATABASE_HOST: 'MYDBHOST1',
        DATABASE_PASSWORD: 'MYSUPERSECRET1',
        QUEUE_CONNECTION_STRING: 'HTTPS://RMQ//MYQUEUE1'
    },
    Process2: {
        DATABASE_HOST: 'MYDBHOST2',
        DATABASE_PASSWORD: 'MYSUPERSECRET2',
        QUEUE_CONNECTION_STRING: 'HTTPS://RMQ//MYQUEUE2'
    }
}

function createEnvironmentalFiles() {
    fs.readFile(dir + '/' + file, 'utf8', function read(err, data) {
        if (err) {
            console.log(err);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                createFile(dir + '/' + file, JSON.stringify(processConfig));
            } else {
                createFile(dir + '/' + file, JSON.stringify(processConfig));
            }

        } else {
            console.log(JSON.parse(data));
            createProcessFiles(JSON.parse(data));
        }

    });
}

function createFile(directory, data) {
    console.log('createFile')
    console.log(directory);
    console.log(data);
    fs.writeFile(directory, data, function (err) {
        if (err) {
            // return console.log(err);
        } else {
            console.log("The file was saved!");
            createProcessFiles(JSON.parse(data));
        }
    });
}

function createProcessFiles(processData) {
    const keys = Object.keys(processData);
    for (var i = 0; i < keys.length; i++) {
        const path = keys[i]
        console.log('createProcessFiles');
        console.log(processData[path]);
        fs.readFile(processData[path] + '/' + file, 'utf8', function read(err, data) {
            if (err) {
                // console.log(err);

                if (!fs.existsSync(processData[path])) {
                    fs.mkdirSync(processData[path]);
                    createProcessFile(processData[path] + '/' + file, JSON.stringify(environments[path]));
                } else {
                    createProcessFile(processData[path] + '/' + file, JSON.stringify(environments[path]));
                }

            } else {
                console.log(JSON.parse(data));
            }
        });
    }
}

function createProcessFile(directory, data) {
    console.log('createFile')
    console.log(directory);
    console.log(data);
    fs.writeFile(directory, data, function (err) {
        if (err) {
            // return console.log(err);
        } else {
            console.log("The file was saved!");
            // createProcessFiles(data);
        }
    });
}

createEnvironmentalFiles();