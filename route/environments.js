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

exports.getListOfProcesses = function (req, res) {

    fs.readFile(dir + '/' + file, 'utf8', function read(err, data) {
        if (err) {
            console.log(err);
            res.send({});
        } else {
            console.log(JSON.parse(data));
            res.send(JSON.parse(data));
        }

    });
}

exports.updateProcess = function (req, res) {
    console.log(req.body);
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
                    fs.writeFile(config[req.params.process] + '/' + file, JSON.stringify(req.body), function (err) {
                        res.send(req.body);
                    });
                }
            })
        }

    });
}

exports.addProcess = function (req, res) {
    console.log(req.body);
    fs.readFile(dir + '/' + req.body.folderName + '/' + file, 'utf8', function read(err, data) {
        if (err) {
            fs.mkdirSync(dir + '/' + req.body.folderName);

            fs.writeFile(dir + '/' + req.body.folderName + '/' + file, JSON.stringify(req.body.config), function (err) {
                if (err) {
                    return res.status(400).send({
                        error: true,
                        message: 'Failed to create Process.'
                    });
                } else {
                    console.log("The file was saved!");
                    fs.readFile(dir + '/' + file, 'utf8', function read(err, data) {
                        if (err) {
                            return res.status(400).send({
                                error: true,
                                message: 'Failed to create Process.'
                            });
                        } else {
                            const config = JSON.parse(data);
                            config[req.body.processName] = dir + '/' + req.body.folderName;
                            fs.writeFile(dir + '/' + file, JSON.stringify(config), function (err) {
                                if (err) {
                                    return res.status(400).send({
                                        error: true,
                                        message: 'Failed to create Process.'
                                    });
                                } else {
                                    return res.send({
                                        error: false,
                                        message: 'Process added.'
                                    });
                                }
                            })
                        }
                    })
                }
            });

        } else {
            return res.status(400).send({
                error: true,
                message: 'Folder already exists.'
            });
        }

    });
}