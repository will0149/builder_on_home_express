import React from 'react';

import ServiceItem from './ServiceItem/ServiceItem';
import './ServiceList.css';

const ServiceList = props => {
  const services = props.services.map(service => {
    return (
      <ServiceItem
        key={service.id}
        serviceId={service.id}
        name={service.name}
        price={service.price}
        userID={props.authUserId}
        creatorId={service.userID}
        onDetail={props.onViewDetail}
      />
    );
  });

  return <ul className="service__list">{services}</ul>;
};

export default ServiceList;