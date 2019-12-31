import React, { Component } from 'react';
import FotoItem from './Foto';
import PubSub from 'pubsub-js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class Timeline extends Component {

  constructor() {
    super();
    this.state = { fotos: [] };
  }

  componentWillMount() {
    PubSub.subscribe('timeline', (topico, fotos) => {
      //console.log(fotos)
      this.setState({ fotos })

    })

    PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
      const fotoAchada = this.state.fotos.find(foto => foto.id === infoLiker.fotoId)
      //console.log(infoLiker)
      fotoAchada.likeada = !fotoAchada.likeada
      const possivelLiker = fotoAchada.likers.find(liker => liker.login === infoLiker.liker.login);
      //console.log(possivelLiker)
      if (possivelLiker === undefined) {
        fotoAchada.likers.push(infoLiker.liker)
      }
      else {
        const novosLikers = fotoAchada.likers.filter(liker => liker.login !== infoLiker.liker.login);
        fotoAchada.likers = novosLikers
        
      }

      this.setState({ fotos: this.state.fotos })
    })

    PubSub.subscribe('novos-comentarios', (topico, infoComentario) => {
      //console.log(infoComentario)
        const fotoAchada = this.state.fotos.find(foto => foto.id === infoComentario.fotoId)
        fotoAchada.comentarios.push(infoComentario.novoComentario)
        this.setState({ fotos:this.state.fotos})
      
    })


  }

  carregaFotos(props) {
    let urlPerfil

    if (props.login === undefined) {
      urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`
    } else {
      urlPerfil = `http://localhost:8080/api/public/fotos/${props.login}`
    }
    // fetch('http://localhost:8080/api/public/fotos/rafael')  
    fetch(urlPerfil)
      .then(response => response.json())
      .then(fotos => {
        this.setState({ fotos: fotos });
      });
  }

  componentDidMount() {
    this.carregaFotos(this.props);

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.login !== undefined) {
      this.carregaFotos(nextProps);
    }

  }
  like(fotoId) {

    fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem("auth-token")}`, { method: 'POST' })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {

          throw new Error("Não Foi Possivel Realizar o Like da Foto!")
        }
      })
      .then(liker => {
        //console.log(like)


        PubSub.publish('atualiza-liker', { fotoId, liker });

      })

  }

  comenta(fotoid, textoComentario) {
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({ texto: textoComentario }),
      headers: new Headers({
        'Content-type': 'application/json'
      })

    }


    fetch(`http://localhost:8080/api/fotos/${fotoid}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("não foi possível comentar");
        }

      })
      .then(novoComentario => {
        PubSub.publish('novos-comentarios', { fotoId: fotoid, novoComentario })

      })


  }




  render() {

    return (
      <div className="fotos container">
        <ReactCSSTransitionGroup
          transitionName="timeline" //comeco do nome das classe no css
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {
            this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like} comenta={this.comenta} />)
          }
        </ReactCSSTransitionGroup>

      </div>
    );
  }
}