import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';

function Profile() {
    const [user, setUser] = React.useState({});
    const [updateUser, setUpdateUser] = React.useState({});
    const navigate = useNavigate();


    // TODO: Only working with access token.
    const getUserProfile = async () => {
        axios.get(global.config.api.url + 'appUser/findByEmail/' + localStorage.getItem('user_email'),
            { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') } })
            .then(res => {
                console.log(localStorage.getItem('access_token'));
                if (res.status === 200) {
                    if (res.data.email !== localStorage.getItem('user_email')) {
                        throw new Error('User not found');
                    }
                    console.log(res.data);
                    setUser(res.data);
                    console.log(user);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (localStorage.getItem('logged_in') === "true") {
            getUserProfile();
        } else {
            navigate('/login');
        }
    }, []);


    return (
        <>
            <Navigation />
            <h2>Profile</h2>
        </>
    )
}

export default Profile