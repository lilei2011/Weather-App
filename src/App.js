import React, { Component } from 'react';
import Forecasts from './Forecasts';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.formatForecast = this.formatForecast.bind(this);
    this.state = {
      error: undefined,
      location:{
        zipcode: undefined,
        city: undefined,
        forecasts: []
      }   
    };
  }
  
  //send http request to the server when user enters the zipcode
  handleSubmit(e) {
    e.preventDefault();
    let location = {
      zipcode: undefined,
      city: undefined,
      forecasts: []
    }
    const zipcode = e.target.elements.zipcode.value.trim();
    location.zipcode = zipcode;
    const url = 'http://api.openweathermap.org/data/2.5/forecast';
    axios.get(`${url}?zip=${zipcode}&units=imperial&appid=5ab0e54f94cd4b682ebe2cdb1675cc56`)
    .then((response) =>{
      let obj = this.handleResponse(response);
      location.city = obj.city;
      location.forecasts = obj.forecasts;
      this.setState({
        location,
        error: null
      });
    })
    .catch((error) =>{
      console.log(error);
      this.setState({
        error: "Not a valid zipcode. Please enter a valid zipcode",
        location: null
      })
    });
  }
  
// handle the case when response status is 200
  handleResponse(response) {
    if (response.status === 200 ) {
      if (response.data) {
        let data = response.data;   
        let forecasts = data.list.filter(entry =>{
          let hour = new Date(entry.dt*1000).getHours();
          return (hour<=21 && hour>=8);       
        })
        .map(forecast => this.formatForecast(forecast));

        return {
          city: data.city.name,
          forecasts
        }
       
      } else {
        this.setState({
          error: "No forecast available",
          location: null
        })
      }
    }
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
          <input type="text" name="zipcode" placeholder="zipcode" className="zipcode"></input>
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
