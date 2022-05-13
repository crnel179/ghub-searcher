import React, { Fragment, Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { About } from './components/pages/About';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import { Alert } from './components/layout/Alert';
import axios from 'axios';
import './App.css';

class App extends Component {
    state = {
        users: [],
        user: {},
        loading: false,
        alert: null,
    };

    async componentDidMount() {
        console.log(process.env.REACT_APP_GITHUB_CLIENT_ID);
        this.setState({ loading: true });

        const res = await axios.get(
            `https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
        );

        this.setState({ users: res.data, loading: false });
    }

    // Search Github users
    searchUser = async (text) => {
        this.setState({ loading: true });

        const res = await axios.get(
            `https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
        );

        this.setState({ users: res.data.items, loading: false });
    };

    // fetch a single user
    getUser = async () => {
        this.setState({ loading: true });

        const res = await axios.get(
            `https://api.github.com/users?${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
        );

        this.setState({ user: res.data, loading: false });
    };

    // clear users from state
    clearUsers = () => this.setState({ users: [], loading: false });

    // set alert
    setAlert = (msg, type) => {
        this.setState({ alert: { msg, type } });

        setTimeout(() => this.setState({ alert: null }), 3000);
    };

    render() {
        const { users, user, loading } = this.state;

        return (
            <Router>
                <div className='App'>
                    <Navbar title=' Github Searcher ' icon='fab fa-github' />
                    <div className='container'>
                        <Alert alert={this.state.alert} />
                        <Routes>
                            <Route
                                path='/'
                                element={
                                    <Fragment>
                                        <Search
                                            searchUser={this.searchUser}
                                            clearUsers={this.clearUsers}
                                            showClear={
                                                users.length > 0 ? true : false
                                            }
                                            setAlert={this.setAlert}
                                        />
                                        <Users
                                            loading={loading}
                                            users={users}
                                        />
                                    </Fragment>
                                }
                            />
                            <Route exact path='/user/:login' render={props => (<User {...props} getUser={this.getUser} user={user} loading={loading} />)} />
                            <Route path='/about' element={<About />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
