import React, { Component } from 'react';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank  from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import './App.css';
import 'tachyons';
import Particles from 'react-particles-js';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';


const particlesOptions = {
  particles: {
    number: {
      value: 1500,
      density: {
        enable: true,
        value_area: 10000
      }
    }
  }
};

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
      
    }
  

  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home'){
      this.setState({isSignedIn: true, route: 'home'})
    } else {
      this.setState({route})
    }
    
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box})
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
    
  }
  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://salty-eyrie-15305.herokuapp.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
          }).then(res => res.json())
          .then(res => {
            if (res) {
              fetch('https://salty-eyrie-15305.herokuapp.com/image', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  id: this.state.user.id
                })
              }).catch(console.log)
              .then(res => res.json())
              .then(count => {this.setState(Object.assign(this.state.user, {entries: count}))})
            }
            this.displayFaceBox(this.calculateFaceLocation(res))})
          .catch(err => console.log(err));
  }


  render() {
    const {imageUrl, route, box, isSignedIn} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
              params={particlesOptions}

            />
        <Navigation route={route} isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
         ? <div> 
            <Logo />
            <Rank count={this.state.user.entries} name={this.state.user.name} />
            <ImageLinkForm 
            onInputChange={this.onInputChange}
            onSubmit={this.onSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
         : (route === 'signin')
          ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> }
      </div>
    );
  }
}

export default App;
