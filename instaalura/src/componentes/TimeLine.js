import React, { Component } from 'react';
import FotoItem from './Foto';
import PubSub from 'pubsub-js'
export default class Timeline extends Component {

    constructor(){
      super();
      this.state = {fotos:[]};
    }

    componentWillMount(){
      PubSub.subscribe('timeline',(topico,fotos) =>{
        //console.log(fotos)
        this.setState({fotos})

      })

    }

    carregaFotos(props){
      let urlPerfil

      if(props.login === undefined){
         urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`
      } else {
        urlPerfil = `http://localhost:8080/api/public/fotos/${props.login}`
      }
      // fetch('http://localhost:8080/api/public/fotos/rafael')  
      fetch(urlPerfil)
       .then(response => response.json())
       .then(fotos => {
         this.setState({fotos:fotos});
       });
    }

    componentDidMount(){
      this.carregaFotos(this.props);
      
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.login !== undefined ){
        this.carregaFotos(nextProps);
      }

    }
    render(){
        return (
        <div className="fotos container">
          {
            this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto}/>)
          }                
        </div>            
        );
    }
}