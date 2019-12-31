import React, { Component } from 'react';
import FotoItem from './Foto';
import PubSub from 'pubsub-js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

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
    like(fotoId)
    {

      fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem("auth-token")}`,{method:'POST'})
    .then(response =>{
      if(response.ok){
        return  response.json()
      } else{

        throw new Error("Não Foi Possivel Realizar o Like da Foto!")
      }
    })
    .then(liker =>{
      //console.log(like)
      

      PubSub.publish('atualiza-liker',{fotoId,liker});

    })

    }

    comenta(fotoid,textoComentario){
      const requestInfo = {
        method: 'POST',
        body: JSON.stringify({texto: textoComentario}),
        headers : new Headers({
          'Content-type':'application/json'
        })
  
      }
  
  
      fetch(`http://localhost:8080/api/fotos/${fotoid}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
        .then(response => {
          if(response.ok){
            return response.json();
        } else {
            throw new Error("não foi possível comentar");
        }
  
        })
        .then(novoComentario => {
          PubSub.publish('novos-comentarios',{fotoId:fotoid,novoComentario})
  
        })
  

    }




    render(){
     
        return (
        <div className="fotos container">
          <ReactCSSTransitionGroup
          transitionName="timeline" //comeco do nome das classe no css
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {
            this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like} comenta={this.comenta}/>)
          }   
          </ReactCSSTransitionGroup>
                       
        </div>            
        );
    }
}