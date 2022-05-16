import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Table } from 'react-bootstrap';
import LoadingScreen from "./LoadingScreen";
import axios from "axios";
import { FaPlusSquare, FaAngleLeft } from "react-icons/fa";

function AddModal(props) {

    const [loading, setLoading] = useState(false);
    const [manualInput, setManualInput] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResponse, setSearchResponse] = useState([]);
    const [manualGame, setManualGame] = useState({ name: "" });

    const searchForGame = async () => {
        setLoading(true);
        setSearchResponse([]);
        await axios.get(global.config.api.url + `game/search?searchTerm=${searchQuery}`,
            {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
                'Content-Type': 'application/json'
            })
            .then(res => setSearchResponse(res.data));
        setLoading(false);
    }

    const addGameToLibrary = async (game) => {
        game = { ...game, aggregatedRating: Math.round(game.aggregatedRating) }
        console.log(game);

        await axios.post(global.config.api.url + `appUserGame/addGame/${localStorage.getItem('user_id')}`, game,
            {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
                'Content-Type': 'application/json'
            })
            .then(res => console.log(res));
        setLoading(false);
        props.onHide();
    }

    const manualGameSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        await addGameToLibrary(manualGame);
        setLoading(false);
    }

    useEffect(() => {
        setManualInput(false);
    }, []);


    if (loading) {
        return (
            <>
                <Modal show={true}
                    style={{ marginTop: 50 }}>
                    <Modal.Header>
                        <Modal.Title>Searching</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <LoadingScreen />
                    </Modal.Body>
                </Modal>
            </>
        );
    }

    if (manualInput) {
        return (<Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button variant="secondary" onClick={() => setManualInput(false)}><FaAngleLeft /></Button>
                <p></p>
                <Form onSubmit={manualGameSubmitHandler}>
                    <Form.Group className="mb-3" controlId="fn-input">
                        <Form.Control type="name" placeholder="Game Name"
                            onChange={e => setManualGame({ ...manualGame, name: e.target.value })} />
                    </Form.Group>
                    <p></p>
                    <Button variant="primary"
                        type="submit"
                        disabled={manualGame.name === ""}>
                        Add Game
                    </Button>

                </Form>

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
                <Button variant="primary" onClick={() => {
                    searchForGame();
                }}>
                    Search
                </Button>
                <p></p>
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
                                <td>{game.aggregatedRating > -1 ? + Math.round(game.aggregatedRating) + '%' : 'Unavailable'}</td>
                                <td><Button variant="primary" onClick={() => {
                                    addGameToLibrary(game);
                                }}>
                                    <FaPlusSquare />
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
            <Button variant="primary" onClick={() => {
                searchForGame();
            }}>
                Search
            </Button>
            <p></p>
            <Button variant="secondary" onClick={() => setManualInput(true)}>Manual Input</Button>
        </Modal.Body>
    </Modal>)

}

export default AddModal;