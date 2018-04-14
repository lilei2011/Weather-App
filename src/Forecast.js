import React from 'react';

const Forecast = (props) => {
   return (
     <div className="temp">
      <span className="item">{props.time}</span><span className="item">{props.temperature}</span>
     </div>
   );
 };

export default Forecast;