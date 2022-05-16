import React from 'react'
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';

function Logout() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_email');
        localStorage.setItem('logged_in', false);
        navigate('/login');
    }

    return (
        <>
            <Navigation />
            <div className="form-wrapper">
                <div className="form-inner">
                    <div className='center'>
                        <Form>
                            <Button variant="primary" type="submit"
                                onClick={handleLogout} >
                                Log Out
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Logout;