import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Table, Button } from 'react-bootstrap';
import Navigation from "./Navigation";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import LoadingScreen from "./LoadingScreen";
import "./library.css";

//TODO: Add a checkbox to include or exclude unrated games.

function Library(props) {
    //76561198000548372
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [gamesList, setGamesList] = useState({});
    const [steamId, setSteamId] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeGame, setActiveGame] = useState({});
    const [nameSearch, setNameSearch] = useState("");
    const [statusSearch, setStatusSearch] = useState("");
    const [ratingSearch, setRatingSearch] = useState("-99");


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
        console.log(gamesList);
    }

    //TODO: this should probably be in the modal component
    const updateGame = async (editedGame) => {
        if (Object.entries(editedGame).length > 0) {
            setLoading(true);
            editedGame.id = activeGame.id;
            console.log(editedGame);
            await axios.put(global.config.api.url + `game/`, editedGame)
                .then(res => console.log(res));
            refreshPage();
        }
        setShowEditModal(false);
    }

    const refreshPage = async () => {
        setActiveGame({});
        await getAllGames();
        setNameSearch("");
        setStatusSearch("");
        setRatingSearch("-99");
        setLoading(false);
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

    const filteredGamesList = Object.values(gamesList).filter((game) => {
        return ((
            game.name.toLowerCase().includes(nameSearch.toLowerCase())
            ||
            game.description.toLowerCase().includes(nameSearch.toLowerCase())
        )
            &&
            game.gameStatus.toLowerCase().includes(statusSearch.toLowerCase())
            && game.aggregatedRating >= parseInt(ratingSearch)
        )

    });




    if (loading) return (
        <LoadingScreen />

    );
    return (
        <>
            <Navigation />
            <Form.Control type="text" placeholder="Enter your Steam ID" onChange={(e) => setSteamId(e.target.value)} />
            <p></p>
            <Button variant="primary" onClick={handleImportButton}>
                Import Steam Library
            </Button>
            <p></p>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>Add New Game</Button>
            <p></p>
            <Form.Control type="text" placeholder="Search by name or description" onChange={(e) => setNameSearch(e.target.value)} />
            <p></p>
            <Form.Control type="text" placeholder="Search by status" onChange={(e) => setStatusSearch(e.target.value)} />
            <p></p>
            <Form.Control type="text" placeholder="Minimum Rating" onChange={(e) => setRatingSearch(e.target.value)} />
            <p></p>
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
                {filteredGamesList.map((game) =>
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