import React from 'react';
import Days from './Days';

const Forecasts = (props) => {
   return (
     <div className="temp-list">
     {props.forecasts && 
      props.forecasts.map((day, index) => (
        <Days 
          key = {index} 
          day = {day[0].day} 
          forecasts = {day}
         />
      ))
    }
     </div>
   );
 };
 
 export default Forecasts;