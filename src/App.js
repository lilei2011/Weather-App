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
    this.groupByDay = this.groupByDay.bind(this);
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
          //get hours between 8am and 9pm
          let forecasts = response.data.list.filter(entry =>{
            let hour = new Date(entry.dt*1000).getHours();
            return (hour<=21 && hour>=8);       
          })
          .map(forecast => this.formatForecast(forecast))
          forecasts = this.groupByDay(forecasts);
  
          let location = {
            zipcode: zipcode,
            city: response.data.city.name,
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

  //format weather forecast time and temperature. time format: Saturday 4/14, 8AM, temperature: Fahrenheit 
  formatForecast(forecast) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(forecast.dt*1000);
    const hour = date.getHours() - 12 > 0 ? date.getHours() - 12 + 'PM' : date.getHours() + 'AM';
    const day = `${days[date.getDay()]} ${date.getMonth()+1}/${date.getDate()} `;
    
    const temperature = Math.floor(forecast.main.temp) + 'F';

    return {
      day,
      hour,
      temperature
    };
  }

  groupByDay(forecasts) {
    let last = forecasts[0];
    let result = [];
    let group = []; 
    group.push(last);
    for(let i=1; i<forecasts.length; i++) {
      
      if(last.day === forecasts[i].day){
        group.push(forecasts[i]);
        
      } else {
        result.push(group);
        group = [];
        group.push(forecasts[i]);
      }
      last = forecasts[i];
    }
    return result;
  }
  render() {
    return (
      <div className="App">
        <h2 className="app-title">Enter zipcode for weather forecast!</h2>
        <form onSubmit={this.handleSubmit}>
          <input onKeyUp={this.handleKeyUp} type="text" name="zipcode" placeholder="e.g., 94040" className="zipcode"></input>
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
