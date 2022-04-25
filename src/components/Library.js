import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Spinner, Container, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import Navigation from "./Navigation";
import "./library.css";

function Library() {
    //76561198000548372
    const [loading, setLoading] = useState(false);
    const [gamesList, setGamesList] = useState({});
    const [steamId, setSteamId] = useState("");
    const [show, setShow] = useState(false);
    const [activeGame, setActiveGame] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    }

    const getSteamGames = async () => {
        setLoading(true);
        console.log(steamId);
        await axios.post(`http://localhost:8080/api/v1/game/steam`, steamId)
            .then(res => console.log(res));

        setLoading(false);
    }

    const getAllGames = async () => {
        setLoading(true);
        await axios.get(`http://localhost:8080/api/v1/game/`)
            .then(res => setGamesList(res.data));
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        getAllGames();
    }, []);

    const handleImportButton = async (e) => {
        e.preventDefault();
        await getSteamGames();
        await getAllGames();
    }



    if (loading) return (
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

    );
    if (Object.keys(gamesList).length === 0) return (
        <>
            <Navigation />
            <p>No games found, try importing your Steam Library!</p>
            <Form.Control type="text" placeholder="Enter your Steam ID" onChange={(e) => setSteamId(e.target.value)} />
            <Button variant="primary" onClick={handleImportButton}>
                Import Steam Library
            </Button>
        </>
    )
    return (
        <>
            <Navigation />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Game Name</th>
                        <th>Description</th>
                        <th>Release Date</th>
                        <th>Rating</th>
                        <th>Playing Status</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                {gamesList.map((game) =>
                    <tbody key={game.id}>
                        <tr>
                            <td>{game.name}</td>
                            <td>{game.description}</td>
                            <td>{game.releaseDate}</td>
                            <td>{game.aggregatedRating > -1 ? + game.aggregatedRating + '%' : 'Unavailable'}</td>
                            <td>{game.gameStatus}</td>
                            <td><Button variant="primary" onClick={() => {
                                setActiveGame(game);
                                console.log(activeGame);
                                setShow(true);
                            }}>
                                Edit
                            </Button></td>
                        </tr>
                    </tbody>
                )}
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="editGameForm">
                            <Form.Label>Name</Form.Label>
                            <Form.Control placeholder={activeGame.name} />
                            <Form.Label>Description</Form.Label>
                            <Form.Control placeholder={activeGame.description} />
                            <Form.Label>Rating</Form.Label>
                            <Form.Control placeholder={activeGame.aggregatedRating} disabled />
                            <Form.Label>Release Date</Form.Label>
                            <Form.Control placeholder={activeGame.releaseDate} disabled />
                            <Form.Label>Status</Form.Label>
                            <Form.Select>
                                <option>Playing</option>
                                <option>On Hold</option>
                                <option>Completed</option>
                                <option>Abandoned</option>
                                <option>Not Set</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {/* TODO make this button add game to backend */}
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

export default Library;