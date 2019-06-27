const fs = require('fs');

const dir = 'c:node-app';
const file = '.env';

exports.getEnvironment = function (req, res) {
    console.log(req.params.process);

    fs.readFile(dir + '/' + file, 'utf8', function read(err, data) {
        if (err) {
            console.log(err);
            res.send({});
        } else {
            console.log(JSON.parse(data));
            const config = JSON.parse(data);
            fs.readFile(config[req.params.process] + '/' + file, 'utf8', function read(err, processData) {
                if (err) {
                    console.log(err);
                    res.send({});
                } else {
                    console.log(JSON.parse(processData));
                    res.send(JSON.parse(processData));
                }
            })
        }

    });
}

exports.setEnvironment = function (req, res) {
    console.log(req.params.process);

    fs.readFile(dir + '/' + file, 'utf8', function read(err, data) {
        if (err) {
            console.log(err);
            res.send({});
        } else {
            console.log(JSON.parse(data));
            const config = JSON.parse(data);
            fs.readFile(config[req.params.process] + '/' + file, 'utf8', function read(err, processData) {
                if (err) {
                    console.log(err);
                    res.send({});
                } else {
                    const parsedData = JSON.parse(processData);
                    parsedData[req.params.key] = req.params.value;
                    fs.writeFile(config[req.params.process] + '/' + file, JSON.stringify(parsedData), function (err) {
                        res.send(parsedData);
                    });
                }
            })
        }

    });
}