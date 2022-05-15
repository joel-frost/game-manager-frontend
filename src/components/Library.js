import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Table, Button, ListGroup } from 'react-bootstrap';
import Navigation from "./Navigation";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import LoadingScreen from "./LoadingScreen";
import NotFoundToolTip from "./NotFoundToolTip";
import "./library.css";
import { FaPlay, FaEdit, FaTrash } from "react-icons/fa";

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
    const [genreSearch, setGenreSearch] = useState("");
    const [playTimeSearch, setPlayTimeSearch] = useState("-99");
    const [user, setUser] = useState({});
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const RatingFilter = Symbol("RatingFilter");
    const StatusFilter = {
        PLAYING: Symbol("Playing"),
        COMPLETED: Symbol("Completed"),
        ONHOLD: Symbol("On Hold"),
        ABANDONED: Symbol("Abandoned"),
        NOT_SET: Symbol("Not Set"),
        UNPLAYED: Symbol("Unplayed"),
    }


    const handleEditModalClose = () => setShowEditModal(false);
    const handleAddModalClose = () => {
        setShowAddModal(false);
        getAllGames();
    }

    const handleQuickFilters = (filter) => {
        resetFilters();
        switch (filter) {
            case RatingFilter:
                setRatingSearch("70");
                break;
            case StatusFilter.PLAYING:
                setStatusSearch("Playing");
                break;
            case StatusFilter.COMPLETED:
                setStatusSearch("Completed");
                break;
            case StatusFilter.ONHOLD:
                setStatusSearch("On Hold");
                break;
            case StatusFilter.ABANDONED:
                setStatusSearch("Abandoned");
                break;
            case StatusFilter.NOT_SET:
                setStatusSearch("Not Set");
                break;
            case StatusFilter.UNPLAYED:
                setPlayTimeSearch("0");
                break;
            default:
                resetFilters();
                break;
        }
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
        resetFilters();
        setLoading(false);
    }

    const resetFilters = () => {
        setNameSearch("");
        setStatusSearch("");
        setRatingSearch("-99");
        setGenreSearch("");
        setPlayTimeSearch("-99");
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

    const deleteGame = async (gameId) => {
        setLoading(true);
        await axios.delete(global.config.api.url + `appUser/deleteGame/${localStorage.getItem('user_email')}/${gameId}`,
            {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
            })
            .then(res => console.log(res));

        await getAllGames();
        setLoading(false);
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
            && game.genre.toLowerCase().includes(genreSearch.toLowerCase())
            && game.playTime >= parseInt(playTimeSearch)
        )

    });

    if (loading) return (
        <LoadingScreen />

    );

    if (gamesList.length > 0) return (
        <>
            <Navigation />
            {!user.steamId && <p>Use Steam? You can automatically import your library! Add your Steam username in <a href="/profile">your profile</a> to get started.</p>}
            <h4>Add Games</h4>
            <ListGroup horizontal>
                {user.steamId &&
                    <ListGroup.Item style={{ border: "none" }}>
                        <Button variant="primary" onClick={handleImportButton}>
                            Import Steam Library
                        </Button>
                    </ListGroup.Item>}
                <ListGroup.Item style={{ border: "none" }}><Button variant="primary" onClick={() => setShowAddModal(true)}>Add New Game</Button></ListGroup.Item>
            </ListGroup>
            <p></p>
            <h4>Quick Filters</h4>
            <ListGroup horizontal>
                <ListGroup.Item style={{ border: "none" }}><Button variant="primary" onClick={() => handleQuickFilters(RatingFilter)}>70+ Rated</Button></ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}><Button variant="primary" onClick={() => handleQuickFilters(StatusFilter.PLAYING)}>Playing</Button></ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}><Button variant="primary" onClick={() => handleQuickFilters(StatusFilter.COMPLETED)}>Completed</Button></ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}><Button variant="primary" onClick={() => handleQuickFilters(StatusFilter.ONHOLD)}>On Hold</Button></ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}><Button variant="primary" onClick={() => handleQuickFilters(StatusFilter.ABANDONED)}>Abandoned</Button></ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}><Button variant="primary" onClick={() => handleQuickFilters(StatusFilter.NOT_SET)}>Not Set</Button></ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}><Button variant="danger" onClick={() => resetFilters()}>Reset Filters</Button></ListGroup.Item>
            </ListGroup>
            <p></p>
            <Button variant="primary" onClick={() => {
                resetFilters();
                setShowAdvancedFilters(!showAdvancedFilters);
            }}>
                Toggle Advanced Filters
            </Button>
            <p></p>
            {
                showAdvancedFilters &&
                <>
                    <Form.Control type="text" placeholder="Search by name or description" onChange={(e) => setNameSearch(e.target.value)} />
                    <p></p>
                    <Form.Control type="text" placeholder="Search by status" onChange={(e) => setStatusSearch(e.target.value)} />
                    <p></p>
                    <Form.Control type="text" placeholder="Minimum Rating" onChange={(e) => setRatingSearch(e.target.value)} />
                    <p></p>
                    <Form.Control type="text" placeholder="Genre" onChange={(e) => setGenreSearch(e.target.value)} />
                    <p></p>
                    <Form.Control type="text" placeholder="Play Time" onChange={(e) => setPlayTimeSearch(e.target.value * 60)} />
                </>
            }
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Genre</th>
                        <th>Release Date</th>
                        <th>Rating</th>
                        <th>Hours Played</th>
                        <th>Playing Status</th>
                        <th></th>
                    </tr>
                </thead>
                {filteredGamesList.map((game) =>
                    <tbody key={game.id}>
                        <tr>
                            <td>{game.name}</td>
                            <td>{game.description ? game.description : <NotFoundToolTip />}</td>
                            <td>{game.genre ? game.genre : <NotFoundToolTip />}</td>
                            <td>
                                {game.releaseDate && new Date(game.releaseDate) > new Date('1990-01-01')
                                    ? new Date(game.releaseDate).toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' })
                                    : <NotFoundToolTip />}
                            </td>
                            <td>{game.aggregatedRating > -1 ? + Math.round(game.aggregatedRating * 10) / 10 + '%' : <NotFoundToolTip />}</td>
                            <td>{game.playTime > -1 ? Math.round(game.playTime / 60) : <NotFoundToolTip />}</td>
                            <td>{game.gameStatus}</td>
                            <td>
                                {game.steamAppId > 0 &&
                                    <>
                                        <Button href={`steam://run/${game.steamAppId}/`} variant="primary"><FaPlay /></Button>
                                        <p></p>
                                    </>
                                }
                                <Button variant="primary" onClick={() => {
                                    setActiveGame(game);
                                    setShowEditModal(true);
                                }}>
                                    <FaEdit />
                                </Button>
                                <p></p>
                                <Button variant="danger" onClick={() => { if (window.confirm(`Are you sure you want to remove ${game.name} from your library?`)) deleteGame(game.id) }}><FaTrash /></Button>
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
            {user.steamId && <p>Import your Steam library or manually add some games to get started.</p>}
            {!user.steamId && <p>Use Steam? You can automatically import your library! Add your Steam username in <a href="/profile">your profile</a> to get started.</p>}
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