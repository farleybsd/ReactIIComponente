import React from 'react';
import ReactDOM from 'react-dom';
import './CSS/reset.css'
import './CSS/timeline.css'
import './CSS/login.css'
import App from './App';
import Login from './componentes/Login'
import Logout from './componentes/Logout'
import {Router,Route,browserHistory} from 'react-router';
import {matchPattern} from 'react-router/lib/PatternUtils';


function verificaAutenticacao(nexState,replace){

    const resultado = matchPattern('/timeline(/:login)',nexState.location.pathname)
    const enderecoPrivadoTimeLine = resultado.paramValues[0] === undefined
    if(enderecoPrivadoTimeLine && localStorage.getItem('auth-token') === null){
        replace('/?msg=Você precisa estar logado para acessar o endereco')
    }
}

ReactDOM.render( 
    (
    <Router history ={browserHistory}>
        <Route path="/" component={Login} />
        <Route path="/timeline(/:login)" component={App} onEnter ={ verificaAutenticacao}/>
        {/*<Route path="/timeline/:login" component={App} />*/}
        <Route path="/logout" component={Logout} />
    </Router>
    
    ) , document.getElementById('root'));