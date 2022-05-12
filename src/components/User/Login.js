import axios from "axios";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation";

function Login() {

    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [localDetails, setLocalDetails] = useState({ email: "", password: "" });

    const submitHandler = (e) => {
        e.preventDefault();
        login(localDetails);
    }

    const login = details => {
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(details),
            url: global.config.api.url + 'login',
        };
        axios(options).then(res => {
            if (res.status === 200) {
                console.log(res.data);
                localStorage.setItem('access_token', res.data.access_token);
                localStorage.setItem('refresh_token', res.data.refresh_token);
                localStorage.setItem('user_email', details.email);
                localStorage.setItem('logged_in', true);
                setError(false);
                navigate('/library');
            }
        }).catch(err => {
            setError(true);
            console.log("Incorrect details");
        });
    }

    return (
        <>
            <Navigation />
            <div className="form-wrapper">
                <div className="form-inner">
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="form-input">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email"
                                onChange={e => setLocalDetails({ ...localDetails, email: e.target.value })} value={localDetails.email} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="form-input-password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password"
                                onChange={e => setLocalDetails({ ...localDetails, password: e.target.value })} value={localDetails.password} />
                        </Form.Group>
                        <Button variant="primary" type="submit"
                            disabled={localDetails.email === "" || localDetails.password === ""} >
                            Submit
                        </Button>

                        {error && <p className="error">Incorrect details</p>}

                        <p>Don't have an account? <a href="signup">sign up</a></p>

                    </Form>
                </div>
            </div>
        </>
    );
}

export default Login;
