import React from 'react';

import './ServiceItem.css';

const ServiceItem = props => (
  <li key={props.serviceId} className="services__list-item">
    <div>
      <h1>{props.name}</h1>
      <h2>
        ${props.price}
      </h2>
    </div>
    <div>
      {props.userID === props.creatorId ? (
        <p>You're the owner of this service.</p>
      ) : (
        <button className="btn" onClick={props.onDetail.bind(this, props.serviceId)}>
          View Details
        </button>
      )}
    </div>
  </li>
);

export default ServiceItem;