import React from 'react';
import { Spinner, Container, Row, Col } from 'react-bootstrap';
import Navigation from './Navigation';

function LoadingScreen() {

    return (
        <>
            <Navigation />
            <Container className="vertical-center">
                <Row className="text-center"><Row>
                    <Col>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Col>
                </Row></Row>
            </Container>
        </>
    )
}

export default LoadingScreen;