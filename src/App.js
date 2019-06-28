import React, { Component } from 'react';
import './App.css';

import $ from 'jquery';


class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            processes: {},
            selectedProcess: '',
            selectedProcessData: [],
            newProcessName: '',
            newProcessFolder: ''
        };
    }

    componentWillMount() {
        this.getEnvironments();
    }

    getEnvironments() {
        fetch("http://localhost:3200/getListOfProcesses")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({ processes: result });
                },
                (error) => {
                    console.log(error);
                }
            )

    }

    selectProcess(process) {
        this.setState({ selectedProcess: process });

        fetch("http://localhost:3200/getEnvironment/" + process)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    const keys = Object.keys(result);
                    const selectedProcessData = [];
                    for (var i = 0; i < keys.length; i++) {
                        selectedProcessData.push({
                            key: keys[i],
                            value: result[keys[i]]
                        })
                    }
                    this.setState({ selectedProcessData: selectedProcessData });
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    changeProcessData(index, key, event) {
        // console.log(processKey, index);
        let selectedProcessData = this.state.selectedProcessData;
        selectedProcessData[index][key] = event.target.value;
        this.setState({ selectedProcessData: selectedProcessData });
    }

    updateProcess() {
        var data = {};
        this.state.selectedProcessData.map((process, key) => {
            data[process['key']] = process['value'];
        })
        console.log(data)
        fetch("http://localhost:3200/updateProcess/" + this.state.selectedProcess, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log('updated');
                    $("#updateModal").modal('hide');
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    annNewElement() {
        const selectedProcessData = this.state.selectedProcessData;
        selectedProcessData.push(
            {
                key: '',
                value: ''
            }
        )
        this.setState({ selectedProcessData: selectedProcessData });
    }

    openAddModal() {
        const selectedProcessData = [{
            key: '',
            value: ''
        }]

        this.setState({ selectedProcessData: selectedProcessData });
    }

    handleChange(key, event) {
        let change = {}
        change[key] = event.target.value
        this.setState(change)
    }

    addProcess() {
        if (this.state.newProcessFolder === '' || this.state.newProcessName === '') {
            alert('Missing mandatory fields');
        } else {
            var data = {};
            this.state.selectedProcessData.map((process, key) => {
                data[process['key']] = process['value'];
            })
            console.log(data)
            const body = {
                folderName: this.state.newProcessFolder,
                processName: this.state.newProcessName,
                config: data
            }

            fetch("http://localhost:3200/addProcess/", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.error) {
                            alert(result.message);
                        } else {
                            console.log('added');
                            this.setState({ newProcessFolder: '', newProcessName: '' });
                            $("#addModal").modal('hide');
                            this.getEnvironments();
                        }

                    },
                    (error) => {
                        console.log(error);
                    }
                )
        }
    }


    render() {
        return (
            <div className="App container">
                <h1>Environment Details</h1>
                <div style={{ textAlign: 'right', margin: '30px' }}>
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#addModal" onClick={this.openAddModal.bind(this)}>Add Process</button>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Process Name</th>
                            <th>Path</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(this.state.processes).map((process, key) => {
                                return <tr key={key}>
                                    <td>{process}</td>
                                    <td >{this.state.processes[process]}</td>
                                    <td><button type="button" className="btn btn-success" data-toggle="modal" data-target="#updateModal" onClick={this.selectProcess.bind(this, process)}>Edit</button></td>
                                </tr>
                            })
                        }

                    </tbody>
                </table>

                <div id="updateModal" className="modal fade" role="dialog">
                    <div className="modal-dialog modal-lg">

                        <div className="modal-content">
                            <div className="modal-header" style={{ display: 'block' }}>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">{this.state.selectedProcess}</h4>
                            </div>
                            <div className="modal-body">
                                <div style={{ textAlign: 'right', margin: '10px' }}>
                                    <button type="button" className="btn btn-success" onClick={this.annNewElement.bind(this)}>Add element</button>
                                </div>
                                {
                                    this.state.selectedProcessData.map((process, key) => {
                                        return <div className="row" key={key}>
                                            <div className="col-md-1"></div>
                                            <input type="text" className="col-md-4" style={{ margin: '5px 0' }} value={process['key']} onChange={this.changeProcessData.bind(this, key, 'key')} placeholder='key' />
                                            <div className="col-md-1">:</div>
                                            <input type="text" className="col-md-5" style={{ margin: '5px 0' }} value={process['value']} onChange={this.changeProcessData.bind(this, key, 'value')} placeholder='value' />
                                        </div>
                                    })
                                }

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.updateProcess.bind(this)} >Save</button>
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>

                            </div>
                        </div>

                    </div>
                </div>


                <div id="addModal" className="modal fade" role="dialog">
                    <div className="modal-dialog modal-lg">

                        <div className="modal-content">
                            <div className="modal-header" style={{ display: 'block' }}>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">Add Process</h4>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    {/* <div className="col-md-1"></div> */}
                                    <div className="col-md-5" style={{ textAlign: 'right' }}>
                                        <div style={{ marginTop: '10px' }}>Process Name<span style={{ color: 'red' }}>*</span>:</div>
                                    </div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-5" style={{ padding: '0px' }}>
                                        <input type="text" style={{ margin: '5px 0', width: '100%' }} value={this.state.newProcessName} onChange={this.handleChange.bind(this, 'newProcessName')} placeholder='Process Name' />
                                    </div>
                                </div>

                                <div className="row">
                                    {/* <div className="col-md-1"></div> */}
                                    <div className="col-md-5" style={{ textAlign: 'right' }}>
                                        <div style={{ marginTop: '10px' }}>Folder Name<span style={{ color: 'red' }}>*</span>:</div>
                                    </div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-5" style={{ padding: '0px' }}>
                                        <input type="text" style={{ margin: '5px 0', width: '100%' }} value={this.state.newProcessFolder} onChange={this.handleChange.bind(this, 'newProcessFolder')} placeholder='Folder Name' />
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', margin: '10px' }}>
                                    <button type="button" className="btn btn-success" onClick={this.annNewElement.bind(this)}>Add element</button>
                                </div>
                                {
                                    this.state.selectedProcessData.map((process, key) => {
                                        return <div className="row" key={key}>
                                            <div className="col-md-1"></div>
                                            <input type="text" className="col-md-4" style={{ margin: '5px 0' }} value={process['key']} onChange={this.changeProcessData.bind(this, key, 'key')} placeholder='key' />
                                            <div className="col-md-1">:</div>
                                            <input type="text" className="col-md-5" style={{ margin: '5px 0' }} value={process['value']} onChange={this.changeProcessData.bind(this, key, 'value')} placeholder='value' />
                                        </div>
                                    })
                                }

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.addProcess.bind(this)} >Save</button>
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>

                            </div>
                        </div>

                    </div>
                </div>


            </div>
        );
    }
}

export default App;
