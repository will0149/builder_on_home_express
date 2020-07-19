import React from 'react';

import ServiceContractItem from './ServiceItem/ServiceContractItem';
// import './ServiceList.css';

const ServiceContractList = props => {
  const services = props.services.map(service => {
    let worker = service.worker[0];
    // if (worker !== null){
    //   console.log(worker.name);
    // }
    return (
      <ServiceContractItem
        key={service.id}
        workerId={service.userID}
        worker={worker}
        serviceId={service.id}
        name={service.name}
        price={service.price}
        description={service.description}
        userID={props.authUserId}
        onDetail={props.onViewDetail}
      />
    );
  });

  return <ul className="service__list">{services}</ul>;
};

export default ServiceContractList;