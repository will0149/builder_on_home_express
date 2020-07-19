import React from 'react';

// import './ServiceContractItem.css';

const ServiceContractItem = props => (
        <div className="card promoting-card" key={props.serviceId}>

            <div className="card-body d-flex flex-row">
                <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-8.jpg" className="rounded-circle mr-3" height="50px" width="50px" alt="avatar" />

                <div>
                    {props.worker != null ? <h4 className="card-title font-weight-bold mb-2">{props.worker.name}</h4> : null}
                    {props.worker != null ? <p class="card-text"><i class="far fa-clock pr-2"></i>{props.worker.phone_number}</p>  : null}
                </div>

            </div>

            {/* <div className="view overlay">
                <img className="card-img-top rounded-0" src="https://mdbootstrap.com/img/Photos/Horizontal/Food/full page/2.jpg" alt="Card image cap">
                    <a href="#!">
                        <div className="mask rgba-white-slight"></div>
                    </a>
</div> */}

                <div className="card-body">

                    <div className="collapse-content">
                        <h3>{props.name}</h3>

                        <p className="card-text" id="collapseContent">{props.description}</p>
                        <button className="btn btn-lg btn-success" type="submit">Contratar</button>

                    </div>
                </div>

            </div>
);

export default ServiceContractItem;