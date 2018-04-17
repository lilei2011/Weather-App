import React from 'react';
import Day from './Day';

const Days = (props) => {
   return (
      <div className="group">
         <div className="group-title">{props.day}</div>
         <div>
            {props.forecasts.map((day, index) => (
               <Day
               key = {index} 
               forecast = {day}
               />
            ))
            }
         </div>
      </div>
    );
 };

export default Days;
