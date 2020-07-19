import React, { Component } from 'react';

import Modal from '../components/modal/Modal';
import Backdrop from '../components/backdrop/BackDrop';
import ServiceContractList from '../components/Services/ServicetList/ServiceContraList.js';
import Spinner from '../components/spinner/Spinner';
import AuthContext from '../context/auth-context';

// import './Service.css';

class HomePage extends Component {
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

        const service = { name, categoryID, description, price }

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
            {
                services
                {
                  id
                      name
                      userID
                      categoryID
                      description
                      price
                      active
                      active
                      created
                      updated_date
                      worker{
                        name
                        email
                        phone_number
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
                console.log('resData.data ' + resData.data.services);
                const services = resData.data.services;
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
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                        <ServiceContractList
                            services={this.state.services}
                            authUserId={this.context.userId}
                            onViewDetail={this.showDetailHandler}
                        /> 
                    )}
            </React.Fragment>
        );
    }
}

export default HomePage;