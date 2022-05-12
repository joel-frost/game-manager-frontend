import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import Navigation from '../Navigation';

function Profile(props) {
    const [user, setUser] = React.useState({});
    const [updateUser, setUpdateUser] = React.useState({});
    const navigate = useNavigate();
    const [showModal, setShowModal] = React.useState(false);
    const handleCloseModal = () => setShowModal(false);


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

    const getSteamIdFromUsername = async (username) => {

    }

    const updateUserProfile = async () => {
        console.log(updateUser);
        if (updateUser.steamUsername.length > 0) {
            getSteamIdFromUsername(updateUser.steamUsername);
        }
        axios.put(global.config.api.url + 'appUser/update/' + user.email, updateUser,
            {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
                'Content-Type': 'application/json'
            })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    getUserProfile();
                    console.log(user);
                }
            }).catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (localStorage.getItem('logged_in') === "true") {
            getUserProfile();
            setShowModal(true);
        } else {
            navigate('/login');
        }
    }, []);


    return (

        <>
            <Navigation />
            <Form>
                <Form.Group className="mb-3" controlId="editGameForm">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control placeholder={user.firstName}
                        onChange={(e) => { updateUser.firstName = e.target.value }} />
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control placeholder={user.lastName}
                        onChange={(e) => { updateUser.lastName = e.target.value }} />
                    <Form.Label>Steam Username</Form.Label>
                    <Form.Control placeholder={user.steamUsername}
                        onChange={(e) => { updateUser.steamUsername = e.target.value }} />
                </Form.Group>
            </Form>
            <Button variant="secondary" onClick={handleCloseModal}>
                Close
            </Button>
            <Button variant="primary" onClick={updateUserProfile}>
                Save Changes
            </Button>
        </>
    )
}

export default Profile