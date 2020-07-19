import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import HomePage from './pages/Home';
import ContractsPage from './pages/Contracts';
import ServicePage from './pages/Service';
import ProfilePage from './pages/Profile';
import MainNavigation from './components/navigation/MainNavigation';
import AuthContext from './context/auth-context';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
        
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {!this.state.token && <Redirect from="/" to="/auth" exact />}
                {this.state.token && <Redirect from="/auth" to="/home" exact />}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                {this.state.token && (
                  <Route path="/home" component={HomePage} />
                )}
                {this.state.token && (
                  <Route path="/contracts" component={ContractsPage} />
                )}
                {this.state.token && (
                  <Route path="/service" component={ServicePage} />
                )}
                {this.state.token && (
                  <Route path="/profile" component={ProfilePage} />
                )}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
