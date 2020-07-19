import React, { Component } from 'react';

import Modal from '../components/modal/Modal';
import Backdrop from '../components/backdrop/BackDrop';
import ServiceList from '../components/Services/ServicetList/ServiceList';
import Spinner from '../components/spinner/Spinner';
import AuthContext from '../context/auth-context';

// import './Service.css';

class ServicePage extends Component {
    state = {
        creating: false,
        services: [],
        isLoading: false,
        selectedService: null
    };
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.nameEl = React.createRef();
        this.categoryIDEl = React.createRef();
        this.descriptionEl = React.createRef();
        this.priceEl = React.createRef();
    }

    componentDidMount() {
        this.fetchServices();
    }

    startCreateServiceHandler = () => {
        this.setState({ creating: true });
    };

    modalConfirmHandler = () => {
        this.setState({ creating: false });
        const name = this.nameEl.current.value;
        const categoryID = this.categoryIDEl.current.value;
        const description = this.descriptionEl.current.value;
        const price = this.priceEl.current.value;

        if (
            name.trim().legth === 0 ||
            categoryID.trim().legth === 0 ||
            description.trim().legth === 0 ||
            price <= 0
        ) {
            return;
        }

        let requestBody = {
            query: `
                mutation{
                    addUserService(
                      name:"${name}",
                      userID:"${this.context.userId}",
                      categoryID: ${categoryID},
                      description:"${description}",
                    price: ${price}){
                      name
                      created
                    }
                  }
            `
        };
        console.log(requestBody);

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                this.fetchServices();
            })
            .catch(err => {
                console.log(err);
            });

        // console.log(service);
    };

    modalCancelHandler = () => {
        this.setState({ creating: false });
    };

    fetchServices() {

        // for(var key in this.context) {
        //     console.log('user '+ key + this.context[key]);
        // }
        this.setState({ isLoading: true });

        let requestBody = {
            query: `
            query {
                user(id:"${this.context.userId}"){
                  service{
                    id
                    name
                    userID
                    price
                    description
                  }
                }
              }
          `
        };

        const token = this.context.token;
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                console.log('resData.data ' + JSON.stringify(resData.data.user.service[0]));
                const services = JSON.parse(JSON.stringify(resData.data.user.service));
                this.setState({ services: services, isLoading: false });
            })
            .catch(err => {
                console.log(err);
                this.setState({ isLoading: false });
            });

    };

    showDetailHandler = serviceId => {
        this.setState(prevState => {
            const selectedService = prevState.events.find(e => e._id === serviceId);
            return { selectedService: selectedService };
        });
    };

    render() {
        // console.log('this.state.services ' + Object.keys(this.state.services));
        // const serviceList = this.state.services.map(service => {
        //     return (
        //         <li key={service.id} className="services__list-item">
        //             {service.name} <q>{service.price}</q>
        //         </li>
        //     );
        // });
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating && (
                    <Modal title="Add Service" canCancel canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        confirmText="Service"
                    >
                        <form className="form">
                            <div >
                                <label htmlFor="name">Service Name</label>
                                <input className="form-control" type="text" id="name" ref={this.nameEl} />
                            </div>
                            <div >
                                <label htmlFor="categoryID">Category</label>
                                <input className="form-control" type="text" id="categoryID" ref={this.categoryIDEl} />
                            </div>
                            <div >
                                <label htmlFor="description">Service Description</label>
                                <input className="form-control"type="text" id="description" ref={this.descriptionEl} />
                            </div>
                            <div >
                                <label htmlFor="price">Price</label>
                                <input className="form-control" type="text" id="price" ref={this.priceEl} />
                            </div>
                        </form>
                    </Modal>
                )}
                {this.state.selectedService && (
                    <Modal
                        title={this.state.selectedService.name}
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        confirmText="Service"
                    >
                        <h1>{this.state.selectedService.name}</h1>
                        <h2>
                            ${this.state.selectedService.price} -{' '}
                        </h2>
                        <p>{this.state.selectedService.description}</p>
                    </Modal>
                )}
                {this.context.token && (
                    <div className="service-control">
                        <p>Create Service for jobs apply</p>
                        <button className="btn" onClick={this.startCreateServiceHandler}>Create Service</button>
                    </div>
                )}
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                        <ServiceList
                            services={this.state.services}
                            authUserId={this.context.userId}
                            onViewDetail={this.showDetailHandler}
                        />
                    )}
            </React.Fragment>
        );
    }
}

export default ServicePage;