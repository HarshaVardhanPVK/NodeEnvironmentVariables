import React, { Component } from 'react';
import './App.css';

// import $ from 'jquery';

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            processes: {},
            selectedProcess: '',
            selectedProcessData: {}
        };
    }

    componentWillMount() {

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
                    this.setState({ selectedProcessData: result });
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    changeProcessValue(processKey, event) {
        let selectedProcessData = this.state.selectedProcessData;
        selectedProcessData[processKey] = event.target.value;
        this.setState({ selectedProcessData: selectedProcessData });
    }

    saveProcess() {
        // $("#myModal").modal('hide');
        console.log(this.state.selectedProcessData)
        fetch("http://localhost:3200/updateProcess/" + this.state.selectedProcess, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.selectedProcessData)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log('updated');
                    alert('Updated Successfully.')
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    render() {
        return (
            <div className="App container">
                <h1>Environment Details</h1>
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
                                    <td><button type="button" className="btn btn-success" data-toggle="modal" data-target="#myModal" onClick={this.selectProcess.bind(this, process)}>Edit</button></td>
                                </tr>
                            })
                        }

                    </tbody>
                </table>

                <div id="myModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">

                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">{this.state.selectedProcess}</h4>
                            </div>
                            <div className="modal-body">

                                {
                                    Object.keys(this.state.selectedProcessData).map((processKey, key) => {
                                        return <div className="row" key={key}>
                                            <div className="col-md-6 processLabel" style={{ marginTop: '10px' }}>{processKey}:</div>
                                            <input type="text" className="col-md-5" style={{ margin: '5px 0' }} value={this.state.selectedProcessData[processKey]} onChange={this.changeProcessValue.bind(this, processKey)} />
                                        </div>
                                    })
                                }

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.saveProcess.bind(this)} >Save</button>
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
