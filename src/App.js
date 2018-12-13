import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '00126a3710ee46089b2068afeff3fdfd'
 });

const particleOptions = {
  particles: {
    number: {
      value: 90,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        joined: ''
      }
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000/')
      .then(response => response.json())
      .then(console.log)
  }

  calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width, // percent of left
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    const { input, user } = this.state;

    this.setState({imageUrl: input})

    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input) // this.state.imageURL -> error
      .then(response => {
        // console.log('response', response)
        console.log('user', user)
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: user.id,
            })
          })
          .then(response => response.json())
          .then(entries => {
            this.setState(
              Object.assign(this.state.user, { entries })
              /* {
              user: {
                entries
              }
              } */
            )
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route })
  }

  loadUser = (user) => {
    const { id, name, email, password, entries, joined } = user
    this.setState({
      user: {
        id,
        name,
        email,
        password,
        entries,
        joined
      }
    })
  }

  loadInfo = (user) => {
    const { id, name, email, password, entries, joined } = user
    this.setState({
      user: {
        id,
        name,
        email,
        password,
        entries,
        joined
      }
    })
  }

  render() {
    const { isSignedIn, imageUrl, box, route, user } = this.state
    const { name, entries } = user

    return (
      <div className="App">
      <Particles className='particles'
        params={particleOptions}
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
          ? 
          ( 
            <div>
              <Logo />
              <Rank name={name} entries={entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          )
          :
          (
            this.state.route === 'signin'
            ? <SignIn loadInfo={this.loadInfo} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
