import React from "react";
import { Form, Button } from "react-bootstrap";
import Navigation from "./Navigation";

function Login() {
    return (
        <>
            <div className="login-wrapper">
                <div className="login-inner">
                    <Form>
                        <Form.Group className="mb-3" controlId="loginEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="loginPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Button variant="primary" href="/library">
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