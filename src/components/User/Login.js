import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Navigation from "../Navigation";

// Not working properly as async state isnt updated before end of function
// check https://www.youtube.com/watch?v=91qEdc6dSUs for how to fix
// may need to change other components to use useEffect

function Login() {

    const [user, setUser] = useState({ email: "", password: "" });
    const [error, setError] = useState(false);
    const [localDetails, setLocalDetails] = useState({ email: "", password: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const submitHandler = (e) => {
        e.preventDefault();
        login(localDetails);
    }

    //TODO make this call the backend for login
    const login = details => {
        const tempObj = { email: "test@test.com", password: "test" };
        if (details.email === tempObj.email && details.password === tempObj.password) {
            setIsLoggedIn(true);
            console.log("Logged in");
            console.log(isLoggedIn);
            setError(false);
        }
        else {
            setError(true);
            console.log("Incorrect details");
        }
    }

    const logout = () => {
        console.log("logout");
    }


    return (
        <>
            <div className="login-wrapper">
                <div className="login-inner">
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="loginEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email"
                                onChange={e => setLocalDetails({ ...localDetails, email: e.target.value })} value={localDetails.email} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="loginPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password"
                                onChange={e => setLocalDetails({ ...localDetails, password: e.target.value })} value={localDetails.password} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>

                        <p>Don't have an account? <a href="signup">sign up</a></p>

                    </Form>
                </div>
            </div>
        </>
    );
}

export default Login;
