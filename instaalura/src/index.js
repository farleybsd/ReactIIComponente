import React from 'react';
import ReactDOM from 'react-dom';
import './CSS/reset.css'
import './CSS/timeline.css'
import './CSS/login.css'
import App from './App';
import Login from './componentes/Login'
import {Router,Route,browserHistory} from 'react-router';

ReactDOM.render( 
    (
    <Router history ={browserHistory}>
        <Route path="/" component={Login} />
        <Route path="/timeline" component={App}/>
    </Router>
    
    ) , document.getElementById('root'));