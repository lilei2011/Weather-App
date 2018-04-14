import React, { Component } from 'react';
import Forecasts from './Forecasts';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.formatForecast = this.formatForecast.bind(this);
    this.sendHttpRequest = this.sendHttpRequest.bind(this);
    this.filterHours = this.filterHours.bind(this);
    this.state = {
      error: undefined,
      location:{
        zipcode: undefined,
        city: undefined,
        forecasts: []
      }   
    };
    this.timer = null;
    this.errorMessages = ["Not a valid zipcode", "No data available"];
  }
  
  //send http request to the server when user enters the zipcode
  handleSubmit(e) {
    e.preventDefault();
    const zipcode = e.target.elements.zipcode.value.trim();
    this.sendHttpRequest(zipcode);
  }

  //send request upon keyup pause for 500ms
  handleKeyUp(e) {
    e.persist();
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let zipcode = e.target.value.trim();
      if(/^\d+$/.test(zipcode) && zipcode.length === 5) {
        this.sendHttpRequest(zipcode);
      } else if(zipcode.length >= 5){
        console.log("not a valid zipcode");
        this.setState({
            error: this.errorMessages[0],
            location: null
        })
      }else {
        this.setState({
          error: null,
          location: null
      })
      }
    }, 500);
  }

  sendHttpRequest(zipcode) {
    const url = 'http://api.openweathermap.org/data/2.5/forecast';
    axios.get(`${url}?zip=${zipcode}&units=imperial&appid=5ab0e54f94cd4b682ebe2cdb1675cc56`)
    .then((response) =>{
      if (response.status === 200 ) {
        if (response.data) {
          let data = response.data;   
          let forecasts = 
            data.list.filter(entry =>{
            let hour = new Date(entry.dt*1000).getHours();
            return (hour<=21 && hour>=8);       
          })
          .map(forecast => this.formatForecast(forecast));
  
          let location = {
            zipcode: zipcode,
            city: data.city.name,
            forecasts
          }
          this.setState({
            location,
            error: null
          });
        } else {
            this.setState({
            error: this.errorMessages[1],
            location: null
            });
        }
      }  
    })
    .catch((error) =>{
      console.log(error);
      this.setState({
        error: this.errorMessages[0],
        location: null
      })
    });
  }

//  filter time between 8am to 9pm
  filterHours(list) {
    let hours = list.filter(entry =>{
      let hour = new Date(entry.dt*1000).getHours();
      return (hour<=21 && hour>=8);      
    });
  }

  //format weather forecast time and temperature. time format: Saturday 4/14, 8AM, temperature: Fahrenheit 
  formatForecast(forecast) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(forecast.dt*1000);
    const hour = date.getHours() - 12 > 0 ? date.getHours() - 12 + 'PM' : date.getHours() + 'AM';
    const timeFormatted = `${days[date.getDay()]} ${date.getMonth()+1}/${date.getDate()}, ${hour} `;
    
    const temperature = Math.floor(forecast.main.temp) + 'F';
    return {
      time: timeFormatted,
      temperature
    };
  }
  render() {
    return (
      <div className="App">
        <h2 className="app-title">Enter zipcode for weather forecast!</h2>
        <form onSubmit={this.handleSubmit}>
          <input onKeyUp={this.handleKeyUp} type="text" name="zipcode" placeholder="zipcode" className="zipcode"></input>
        </form>
        {this.state.location && 
          <div>
            <div className='cityInfo'>{this.state.location.city}  {this.state.location.zipcode}</div>  
            <Forecasts forecasts={this.state.location.forecasts}/>
          </div>}
        {this.state.error && <div className='error'>{this.state.error}</div>}
      </div>
    );
  }
}

export default App;
