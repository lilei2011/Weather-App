import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import { debounce } from 'lodash';
import Forecasts from './Forecasts';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.formatForecast = this.formatForecast.bind(this);
    this.state = {
      error: undefined,
      zipcode: undefined,
      forecasts: []
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    const zipcode = e.target.elements.zipcode.value.trim();
    this.setState({zipcode});
    const url = 'http://api.openweathermap.org/data/2.5/forecast';
    axios.get(`${url}?zip=${zipcode}&units=imperial&appid=5ab0e54f94cd4b682ebe2cdb1675cc56`)
    .then((response) =>{
      this.handleResponse(response);
    })
    .catch((error) =>{
      console.log(error);
    });
  }


  handleResponse(response) {
    console.log(response);
    if(response.status === 200 && response.data) {

      let data = response.data;   
      let forecasts = data.list.filter(entry =>{
        let hour = new Date(entry.dt*1000).getHours();
        return (hour<=21 && hour>=8);       
      })
      .map(forecast => this.formatForecast(forecast));

      this.setState({
        city: data.city.name,
        forecasts
      })
    }
  }
  formatForecast(forecast) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(forecast.dt*1000);
    const hour = date.getHours()-12>0 ? date.getHours()-12 + 'PM' : date.getHours() + 'AM';
    const timeFormatted = `${days[date.getDay()]} ${date.getMonth()+1}/${date.getDate()}, ${hour} `;
    
    const temperature = Math.floor(forecast.main.temp) + 'F';
    let entry = {
      time: timeFormatted,
      temperature
    };
    return entry;

  }
  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="zipcode" placeholder="zipcode" className="zipcode"></input>
        </form>
        {this.state.city &&<div className='cityInfo'>{this.state.city}  {this.state.zipcode}</div>}
        <Forecasts forecasts={this.state.forecasts}/>
      </div>
    );
  }
}

export default App;
