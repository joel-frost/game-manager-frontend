import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Table, Button } from 'react-bootstrap';
import Navigation from "./Navigation";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import LoadingScreen from "./LoadingScreen";
import "./library.css";

function Library(props) {
    //76561198000548372
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [gamesList, setGamesList] = useState({});
    const [steamId, setSteamId] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeGame, setActiveGame] = useState({});


    const handleEditModalClose = () => setShowEditModal(false);
    const handleAddModalClose = () => setShowAddModal(false);

    const getSteamGames = async () => {
        setLoading(true);
        console.log(steamId);
        await axios.post(global.config.api.url + `game/steam`, steamId)
            .then(res => console.log(res));

        setLoading(false);
    }

    const getAllGames = async () => {
        setLoading(true);
        await axios.get(global.config.api.url + `game/`)
            .then(res => setGamesList(res.data));
        setLoading(false);
    }

    //TODO: this should probably be in the modal component
    const updateGame = async (editedGame) => {
        if (Object.entries(editedGame).length > 0) {
            setLoading(true);
            editedGame.id = activeGame.id;
            console.log(editedGame);
            await axios.put(global.config.api.url + `game/`, editedGame)
                .then(res => console.log(res));
            setActiveGame({});
            await getAllGames();
            setLoading(false);
        }
        setShowEditModal(false);
    }

    useEffect(() => {
        if (localStorage.getItem('logged_in') !== "true") {
            navigate("/login");
        }
    });

    useEffect(() => {
        if (localStorage.getItem('logged_in') === "true") {
            setLoading(true);
            getAllGames();
        }
    }, []);


    const handleImportButton = async (e) => {
        e.preventDefault();
        await getSteamGames();
        await getAllGames();
    }



    if (loading) return (
        <LoadingScreen />

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
            <Button variant="primary" onClick={() => setShowAddModal(true)}>Add New Game</Button>
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
                                setShowEditModal(true);
                            }}>
                                Edit
                            </Button></td>
                        </tr>
                    </tbody>
                )}
            </Table>
            <AddModal show={showAddModal} onHide={handleAddModalClose} />
            <EditModal show={showEditModal} onHide={handleEditModalClose} updateGame={updateGame} activeGame={activeGame} />
        </>
    );

}

export default Library;