import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import Navigation from '../Navigation';
import LoadingScreen from '../LoadingScreen';

function Profile(props) {
    const [user, setUser] = React.useState({});
    const [updateUser, setUpdateUser] = React.useState({ firstName: "", lastName: "" });
    const [updateSteamDetails, setUpdateSteamDetails] = React.useState({ steamUsername: "" });
    const [isLoading, setIsLoading] = React.useState(true);
    const navigate = useNavigate();

    const resetDetails = () => {
        setUpdateUser({ firstName: "", lastName: "" });
        setUpdateSteamDetails({ steamUsername: "" });
    }


    // TODO: Only working with access token.
    const getUserProfile = async () => {
        setIsLoading(true);
        axios.get(global.config.api.url + 'appUser/findByEmail/' + localStorage.getItem('user_email'),
            { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') } })
            .then(res => {
                if (res.status === 200) {
                    if (res.data.email !== localStorage.getItem('user_email')) {
                        throw new Error('User not found');
                    }
                    setUser(res.data);
                }
            })
            .catch(err => {
                console.log(err);
            });
        resetDetails();
        setIsLoading(false);
    }

    const updateSteamID = async () => {
        setIsLoading(true);
        await axios.post(global.config.api.url + `appUser/addSteamIdFromUsername/${updateSteamDetails.steamUsername}/${localStorage.getItem('user_email')}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
            .then(res => {
                console.log(res.data);
            })

        setIsLoading(false);
        getUserProfile();


    }


    const updateUserProfile = async () => {
        setIsLoading(true);
        axios.put(global.config.api.url + 'appUser/update/' + user.email, updateUser,
            {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
                'Content-Type': 'application/json'
            })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    getUserProfile();
                }
            }).catch(err => {
                console.log(err);
            });
        setIsLoading(false);
        resetDetails();
        getUserProfile();
    }

    useEffect(() => {
        if (localStorage.getItem('logged_in') === "true") {
            resetDetails();
            getUserProfile();
        } else {
            navigate('/login');
        }
    }, []);

    if (isLoading) {
        return (
            <>
                <Navigation />
                <LoadingScreen />
            </>
        )
    }

    return (

        <>
            <Navigation />
            <h4>Personal Information</h4>
            <Form>
                <Form.Group className="mb-3" controlId="editPersonalDetails">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control placeholder={user.firstName}
                        onChange={(e) => { setUpdateUser({ ...updateUser, firstName: e.target.value }) }} value={updateUser.firstName} />
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control placeholder={user.lastName}
                        onChange={(e) => { setUpdateUser({ ...updateUser, lastName: e.target.value }) }} value={updateUser.lastName} />
                </Form.Group>
            </Form>
            <Button variant="primary" onClick={updateUserProfile}>
                Save Changes
            </Button>
            <p></p>
            <h4>Steam Details</h4>
            <Form>
                <Form.Group className="mb-3" controlId="editSteamDetails">
                    <Form.Label>Steam Username</Form.Label>
                    <Form.Control placeholder={user.steamUsername}
                        onChange={(e) => { setUpdateSteamDetails({ ...updateSteamDetails, steamUsername: e.target.value }) }} value={updateUser.steamUsername} />
                    <Form.Label>Steam ID</Form.Label>
                    <Form.Control placeholder={user.steamId} disabled={true} />
                </Form.Group>
                <Button variant="primary" onClick={updateSteamID}
                    disabled={updateSteamDetails.steamUsername.length <= 0}>
                    Save Changes</Button>
            </Form>
        </>
    )
}

export default Profile