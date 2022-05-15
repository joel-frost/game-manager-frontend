import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Table, Button } from 'react-bootstrap';
import Navigation from "./Navigation";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import LoadingScreen from "./LoadingScreen";
import "./library.css";
import { FaPlay, FaEdit } from "react-icons/fa";

//TODO: Add a checkbox to include or exclude unrated games.

function Library(props) {
    //76561198000548372
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [gamesList, setGamesList] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeGame, setActiveGame] = useState({});
    const [nameSearch, setNameSearch] = useState("");
    const [statusSearch, setStatusSearch] = useState("");
    const [ratingSearch, setRatingSearch] = useState("-99");
    const [user, setUser] = useState({});


    const handleEditModalClose = () => setShowEditModal(false);
    const handleAddModalClose = () => {
        setShowAddModal(false);
        getAllGames();
    }

    const getSteamGames = async () => {
        setLoading(true);
        if (!user.steamId) {
            setLoading(false);
            return;
        }
        const steamId = user.steamId;
        await axios.post(global.config.api.url + `game/steam/${steamId}/${localStorage.getItem('user_email')}`,
            {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
                'Content-Type': 'application/json'
            })
            .then(res => console.log(res));

        setLoading(false);
    }

    const getAllGames = async () => {
        setLoading(true);
        await axios.get(global.config.api.url + `appUser/games/${localStorage.getItem('user_email')}`,
            {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
                'Content-Type': 'application/json'
            })
            .then(res => {
                console.log(res.data);
                setGamesList(res.data);
            });
        setLoading(false);
    }

    //TODO: Make this update the game in the user's list.
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
    const getUserProfile = async () => {
        setLoading(true);
        axios.get(global.config.api.url + 'appUser/findByEmail/' + localStorage.getItem('user_email'),
            { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') } })
            .then(res => {
                if (res.status === 200) {
                    if (res.data.email !== localStorage.getItem('user_email')) {
                        throw new Error('User not found');
                    }
                    setUser(res.data);
                }
            })
            .catch(err => {
                console.log(err);
            });
        setLoading(false);
    }

    const refreshPage = async () => {
        setActiveGame({});
        setUser({});
        await getUserProfile();
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
            getUserProfile();
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

    if (gamesList.length > 0) return (
        <>
            <Navigation />
            {!user.steamId && <p>Add your Steam ID in <a href="/profile">your profile</a> to get started.</p>}
            {user.steamId &&
                <>
                    <Button variant="primary" onClick={handleImportButton}>
                        Import Steam Library
                    </Button>
                </>
            }
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
                        <th></th>
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
                                <FaEdit />
                            </Button>
                                {game.steamAppId > 0 &&
                                    <>
                                        <p></p>
                                        <Button href={`steam://run/${game.steamAppId}/`} variant="primary"><FaPlay /></Button>
                                    </>
                                }
                            </td>
                        </tr>
                    </tbody>
                )}
            </Table>
            <AddModal show={showAddModal} onHide={handleAddModalClose} />
            <EditModal show={showEditModal} onHide={handleEditModalClose} updateGame={updateGame} activeGame={activeGame} />
        </>
    );

    return (
        <>
            <Navigation />
            <p>No games added yet. </p>
            {user.steamId && <p>Import your Steam library to get started.</p>}
            {!user.steamId && <p>Add your Steam ID in <a href="/profile">your profile</a> to get started.</p>}
            {user.steamId &&
                <>
                    <Button variant="primary" onClick={handleImportButton}>
                        Import Steam Library
                    </Button>
                </>
            }
            <p></p>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>Add New Game</Button>
            <AddModal show={showAddModal} onHide={handleAddModalClose} />
        </>
    );

}

export default Library;