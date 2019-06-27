import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

    componentDidMount() {

        fetch("http://localhost:3200/getEnvironment")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                }
            )
        // ajax.get("localhost:3200/getEnvironment", function (data, status) {
        //     console.log(status);
        //     console.log(data);
        // });
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
        </p>
            </div>
        );
    }
}

export default App;
