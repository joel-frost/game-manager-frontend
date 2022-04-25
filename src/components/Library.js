import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Spinner, Container, Row, Col, Table, Button } from 'react-bootstrap';
import Navigation from "./Navigation";
import EditModal from "./EditModal";
import "./library.css";

function Library(props) {
    //76561198000548372
    const [loading, setLoading] = useState(false);
    const [gamesList, setGamesList] = useState({});
    const [steamId, setSteamId] = useState("");
    const [show, setShow] = useState(false);
    const [activeGame, setActiveGame] = useState({});


    const handleClose = () => setShow(false);

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

    const updateGame = async (editedGame) => {
        if (Object.entries(editedGame).length > 0) {
            setLoading(true);
            editedGame.id = activeGame.id;
            console.log(editedGame);
            await axios.put(`http://localhost:8080/api/v1/game/`, editedGame)
                .then(res => console.log(res));
            setActiveGame({});
            await getAllGames();
            setLoading(false);
        }
        setShow(false);
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

                                setShow(true);
                            }}>
                                Edit
                            </Button></td>
                        </tr>
                    </tbody>
                )}
            </Table>

            <EditModal show={show} onHide={handleClose} updateGame={updateGame} activeGame={activeGame} />


        </>
    );

}

export default Library;