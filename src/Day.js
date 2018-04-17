import React from 'react';

const Day = (props) => {
   return (
     <div className="list-item">
      <span className="item">{props.forecast.day + props.forecast.hour}</span>
      <span className="item">{props.forecast.temperature}</span>
     </div>
   );
 };

export default Day;