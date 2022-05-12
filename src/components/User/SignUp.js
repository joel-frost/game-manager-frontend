import Navigation from "../Navigation";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

function SignUp() {

    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [localDetails, setLocalDetails] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [confPassword, setConfPassword] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        signUpUser(localDetails);
    }

    const signUpUser = async () => {
        console.log(JSON.stringify(localDetails));
        if (localDetails.password !== confPassword) {
            setError(true);
            return;
        }

        axios.post(global.config.api.url + "appUser/create/user/", localDetails)
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data);
                    navigate("/login");
                }
            }).catch(err => {
                setError(true);
                console.log("Incorrect details");
            });
    }

    useEffect(() => {
        if (localStorage.getItem('logged_in') === "true") {
            navigate("/library");
        }
        setLocalDetails({ firstName: "", lastName: "", email: "", password: "" });
        setConfPassword("");
        setError(false);
    }, []);

    return (
        <>
            <Navigation />
            <div className="form-wrapper">
                <div className="form-inner">
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="fn-input">
                            <Form.Control type="name" placeholder="Enter First Name"
                                onChange={e => setLocalDetails({ ...localDetails, firstName: e.target.value })} value={localDetails.firstName} />
                        </Form.Group>
                        <p></p>
                        <Form.Group className="mb-3" controlId="ln-input">
                            <Form.Control type="name" placeholder="Enter Last Name"
                                onChange={e => setLocalDetails({ ...localDetails, lastName: e.target.value })} value={localDetails.lastName} />
                        </Form.Group>
                        <p></p>
                        <Form.Group className="mb-3" controlId="email-input">
                            <Form.Control type="email" placeholder="Enter email"
                                onChange={e => setLocalDetails({ ...localDetails, email: e.target.value })} value={localDetails.email} />
                        </Form.Group>
                        <p></p>
                        <Form.Group className="mb-3" controlId="password-input">
                            <Form.Control type="password" placeholder="Password"
                                onChange={e => setLocalDetails({ ...localDetails, password: e.target.value })} value={localDetails.password} />
                        </Form.Group>
                        <p></p>
                        <Form.Group className="mb-3" controlId="conf-input">
                            <Form.Control type="password" placeholder="Confirm Password"
                                onChange={e => setConfPassword(e.target.value)} value={confPassword} />
                        </Form.Group>
                        <p></p>
                        <Button variant="primary" type="submit"
                            disabled={localDetails.email === "" || localDetails.password === ""
                            } >
                            Sign Up
                        </Button>

                        {error && <p className="error">Invalid details, check that your passwords match.</p>}

                    </Form>
                </div>
            </div>
        </>
    );

}

export default SignUp;