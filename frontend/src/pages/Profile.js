import React, { Component } from 'react';

import Spinner from '../components/spinner/Spinner';
import AuthContext from '../context/auth-context';

class ProfilePage extends Component {
    state = {
        creating: false,
        userInfo: [],
        isLoading: false,
        selectedService: null
    };
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.nameEl = React.createRef();
        this.phone_numberEl = React.createRef();
        this.directionEl = React.createRef();
        this.typeEl = React.createRef();
    }

    componentDidMount() {
        this.fetchUserInfo();
    }

    submitHandler = event => {
        event.preventDefault();
        console.log('start');
        const name = this.nameEl.current.value;
        const phone_number = this.phone_numberEl.current.value;
        const direction = this.directionEl.current.value;
        const type = this.typeEl.current.value;

        // if (
        //     name.trim().legth === 0 ||
        //     phone_number.trim().legth === 0 ||
        //     type.trim().legth === 0
        // ) {
        //     return;
        // }

        const user = { name, phone_number, direction, type }
        console.log(user);

        let requestBody = {
            query: `
                  mutation{
                    updateUser(
                      id:"${this.context.userId}"
                      name: "${name}"
                      phone_number:"${phone_number}"
                      direction:"${direction}"
                      type:"${type}"
                    ){
                      id
                      updated_date
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
                console.log('respones ' + resData.data.updateUser)
                this.fetchUserInfo();
            })
            .catch(err => {
                console.log(err);
            });

        // console.log(service);
    };

    fetchUserInfo() {

        // for(var key in this.context) {
        //     console.log('user '+ key + this.context[key]);
        // }
        this.setState({ isLoading: true });

        let requestBody = {
            query: `
            query {
                user(id:"${this.context.userId}"){
                    id
                    name
                    direction
                    email
                    phone_number
                    type
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
                console.log('resData.data ' + resData.data.user);
                const userInfo = resData.data.user;
                this.setState({ userInfo: userInfo, isLoading: false });
            })
            .catch(err => {
                console.log(err);
                this.setState({ isLoading: false });
            });

    };

    render() {
        return (
            <div className="container">
                {/* <div className="row">
                        <div className="col-md-3 ">
                            <div className="list-group ">
                                <a href="#" className="list-group-item list-group-item-action active">Dashboard</a>
                                <a href="#" className="list-group-item list-group-item-action">User Management</a>
                            </div>
                        </div>
                    </div> */}
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                        <div className="col-md-12 center">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h4>Your Profile</h4>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form onSubmit={this.submitHandler}>
                                                <div className="form-group row">
                                                    <label htmlFor="name" className="col-4 col-form-label">Name*</label>
                                                    <div className="col-8">
                                                        <input id="name" name="name" value={this.state.userInfo.name} placeholder="Name" defaultValue="" className="form-control here" required="required" type="text" ref={this.nameEl} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="phone_number" className="col-4 col-form-label">Phone Number*</label>
                                                    <div className="col-8">
                                                        <input id="phone_number" name="phone_number" value={this.state.userInfo.phone_number} defaultValue="" placeholder="Phone number" className="form-control here" required="required" type="text" ref={this.phone_numberEl} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="direction" className="col-4 col-form-label">Direction*</label>
                                                    <div className="col-8">
                                                        <input id="direction" name="direction" value={this.state.userInfo.direction} defaultValue="" placeholder="Direction" className="form-control here" required="required" type="text" ref={this.directionEl} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="typeID" className="col-4 col-form-label">Roll Type*</label>
                                                    <div className="col-8">
                                                        <select id="typeID" name="typeID" className="custom-select" defaulValue={this.state.userInfo.type} ref={this.typeEl}>
                                                            <option value="REGULAR">Regular User</option>
                                                            <option value="WORKER">Worker</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className="offset-4 col-8">
                                                        <button className="btn btn-lg btn-success" type="submit">Submit</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
            </div>
        );
    }
}

export default ProfilePage;