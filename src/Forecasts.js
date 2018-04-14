import React from 'react';
import Forecast from './Forecast';
const Forecasts = (props) => {
   return (
     <div className="temp-list">
     {props.forecasts && 
      props.forecasts.map((forecast) => (
        <Forecast key={forecast.time} time={forecast.time} temperature={forecast.temperature} />
      ))
    }
     </div>
   );
 };
 
 export default Forecasts;