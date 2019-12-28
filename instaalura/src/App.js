import React, { Component } from 'react';
import Header from './componentes/Header'
import TimeLine from './componentes/TimeLine'
class App extends Component {
    render() {
        return (
            <div id="root">
            <div className="main">

            <Header/>
            <TimeLine login={this.props.params.login}/>
        </div>
    </div>
        )
    }
}

export default App;