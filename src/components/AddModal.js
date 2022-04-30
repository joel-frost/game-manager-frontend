import React, { useState } from "react";
import { Form, Button, Modal, Table, Badge } from 'react-bootstrap';
import LoadingScreen from "./LoadingScreen";
import axios from "axios";

function AddModal(props) {

    const [loading, setLoading] = useState(false);
    const [manualInput, setManualInput] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResponse, setSearchResponse] = useState([]);
    const [selectedGame, setSelectedGame] = useState({});

    const searchForGame = async () => {
        setLoading(true);
        setSearchResponse([]);
        await axios.get(global.config.api.url + `game/search?searchTerm=${searchQuery}`)
            .then(res => setSearchResponse(res.data));
        console.log(searchResponse);
        setLoading(false);
    }

    const addGameToLibrary = async (game) => {

        game.id = -1;

        await axios.post(global.config.api.url + `game/`, game)
            .then(res => console.log(res));
        setLoading(false);
    }

    if (manualInput) {
        return (<Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="addGameForm">
                        <Form.Label>Form Goes here</Form.Label>
                        <Form.Control
                            onChange={(e) => { console.log(e.target.value) }} />
                    </Form.Group>
                </Form>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>

            </Modal.Body>
        </Modal>)
    }
    if (searchResponse.length > 0) {
        return (<Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="addGameForm">
                        <Form.Label>Search</Form.Label>
                        <Form.Control
                            onChange={(e) => { setSearchQuery(e.target.value) }} />
                    </Form.Group>
                </Form>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                {/* TODO make this button add game to backend */}
                <Button variant="primary" onClick={() => {
                    searchForGame();
                }}>
                    Search
                </Button>
                <Button variant="secondary" onClick={() => setManualInput(true)}>
                    Close
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Game Name</th>
                            <th>Release Date</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    {searchResponse.map((game, index) =>
                        <tbody key={index}>
                            <tr>
                                <td>{game.name}</td>
                                <td>{game.releaseDate}</td>
                                <td>{game.aggregatedRating > -1 ? + game.aggregatedRating + '%' : 'Unavailable'}</td>
                                <td><Button variant="primary" onClick={() => {
                                    addGameToLibrary(game);
                                }}>
                                    Add Game
                                </Button></td>
                            </tr>
                        </tbody>
                    )}
                </Table>

            </Modal.Body>
        </Modal>)
    }

    return (<Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Add Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="addGameForm">
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                        onChange={(e) => { setSearchQuery(e.target.value) }} />
                </Form.Group>
            </Form>
            <Button variant="secondary" onClick={props.onHide}>
                Close
            </Button>
            {/* TODO make this button add game to backend */}
            <Button variant="primary" onClick={() => {
                searchForGame();
            }}>
                Search
            </Button>
            <Button variant="secondary" onClick={setManualInput(true)}>
                Close
            </Button>

        </Modal.Body>
    </Modal>)

}

export default AddModal;