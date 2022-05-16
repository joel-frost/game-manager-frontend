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

function Library(props) {
    //76561198000548372
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [gamesList, setGamesList] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [nameSearch, setNameSearch] = useState("");
    const [statusSearch, setStatusSearch] = useState("");
    const [ratingSearch, setRatingSearch] = useState("-99");
    const [genreSearch, setGenreSearch] = useState("");
    const [playTimeSearch, setPlayTimeSearch] = useState("-99");
    const [user, setUser] = useState({});
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [activeGame, setActiveGame] = useState({
        "id": "",
        "gameStatus": "",
        "playTime": "",
        "game": {}
    });

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
        setActiveGame({
            "id": "",
            "gameStatus": "",
            "playTime": "",
            "game": {}
        });
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
                setGamesList(res.data);
            });
        setLoading(false);
    }

    const updateGame = async (editedGame) => {
        editedGame.id = activeGame.id;
        if (Object.entries(editedGame).length > 0) {
            setLoading(true);
            await axios.put(global.config.api.url + `appUserGame/updateGame`, editedGame,
                {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
                })
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
                    localStorage.setItem('user_id', res.data.id);
                }
            })
            .catch(err => {
                console.log(err);
            });
        setLoading(false);
    }

    const refreshPage = async () => {
        setActiveGame({
            "id": "",
            "gameStatus": "",
            "playTime": "",
            "game": {}
        });
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
        if (document.getElementById("advanced-filters")) {
            document.getElementById("advanced-filters").reset();
        }

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
        await axios.delete(global.config.api.url + `appUserGame/deleteGame/${gameId}`,
            {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
            })
            .then(res => console.log(res));

        await getAllGames();
        setLoading(false);
    }

    const filteredGamesList = Object.values(gamesList).filter((gameObj) => {
        return ((
            gameObj.game.name.toLowerCase().includes(nameSearch.toLowerCase())
            ||
            gameObj.game.description.toLowerCase().includes(nameSearch.toLowerCase())
        )
            &&
            gameObj.gameStatus.toLowerCase().includes(statusSearch.toLowerCase())
            && gameObj.game.aggregatedRating >= parseInt(ratingSearch)
            && gameObj.game.genre.toLowerCase().includes(genreSearch.toLowerCase())
            && gameObj.playTime >= parseInt(playTimeSearch)
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
                <ListGroup.Item style={{ border: "none" }}><Button variant="secondary" onClick={() => setShowAddModal(true)}>Add New Game</Button></ListGroup.Item>
            </ListGroup>
            <p></p>
            <h4>Quick Filters</h4>
            <ListGroup horizontal>
                <ListGroup.Item style={{ border: "none" }}><Button variant="secondary" onClick={() => handleQuickFilters(RatingFilter)}>70+ Rated</Button></ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}><Button variant="secondary" onClick={() => handleQuickFilters(StatusFilter.PLAYING)}>Playing</Button></ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}><Button variant="secondary" onClick={() => handleQuickFilters(StatusFilter.COMPLETED)}>Completed</Button></ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}><Button variant="secondary" onClick={() => handleQuickFilters(StatusFilter.ONHOLD)}>On Hold</Button></ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}><Button variant="secondary" onClick={() => handleQuickFilters(StatusFilter.ABANDONED)}>Abandoned</Button></ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}><Button variant="secondary" onClick={() => handleQuickFilters(StatusFilter.NOT_SET)}>Not Set</Button></ListGroup.Item>
                <ListGroup.Item style={{ border: "none" }}><Button variant="danger" onClick={() => resetFilters()}>Reset Filters</Button></ListGroup.Item>
            </ListGroup>
            <p></p>
            <ListGroup horizontal>
                <ListGroup.Item style={{ border: "none" }}>
                    <Button variant="primary" onClick={() => {
                        resetFilters();
                        setShowAdvancedFilters(!showAdvancedFilters);
                    }}>
                        Toggle Advanced Filters
                    </Button>
                </ListGroup.Item>
            </ListGroup>

            <p></p>
            {
                showAdvancedFilters &&

                <Form id="advanced-filters">
                    <Form.Control type="text" placeholder="Search by name or description" onChange={(e) => setNameSearch(e.target.value)} />
                    <p></p>
                    <Form.Control type="text" placeholder="Search by status" onChange={(e) => setStatusSearch(e.target.value)} />
                    <p></p>
                    <Form.Control type="text" placeholder="Minimum Rating" onChange={(e) => setRatingSearch(e.target.value)} />
                    <p></p>
                    <Form.Control type="text" placeholder="Genre" onChange={(e) => setGenreSearch(e.target.value)} />
                    <p></p>
                    <Form.Control type="text" placeholder="Play Time" onChange={(e) => setPlayTimeSearch(e.target.value * 60)} />
                </Form>
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
                {filteredGamesList.map((gameObj) =>
                    <tbody key={gameObj.id}>
                        <tr>
                            <td>{gameObj.game.name}</td>
                            <td>{gameObj.game.description ? gameObj.game.description : <NotFoundToolTip />}</td>
                            <td>{gameObj.game.genre ? gameObj.game.genre : <NotFoundToolTip />}</td>
                            <td>
                                {gameObj.game.releaseDate && new Date(gameObj.game.releaseDate) > new Date('1990-01-01')
                                    ? new Date(gameObj.game.releaseDate).toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' })
                                    : <NotFoundToolTip />}
                            </td>
                            <td>{gameObj.game.aggregatedRating > -1 ? + Math.round(gameObj.game.aggregatedRating * 10) / 10 + '%' : <NotFoundToolTip />}</td>
                            <td>{gameObj.playTime > -1 ? Math.round(gameObj.playTime / 60) : <NotFoundToolTip />}</td>
                            <td>{gameObj.gameStatus}</td>
                            <td>
                                {gameObj.game.steamAppId > 0 &&
                                    <>
                                        <Button href={`steam://run/${gameObj.game.steamAppId}/`} variant="success"><FaPlay /></Button>
                                        <p></p>
                                    </>
                                }
                                <Button variant="primary" onClick={() => {
                                    setActiveGame({ ...activeGame, game: gameObj.game, gameStatus: gameObj.gameStatus, playTime: gameObj.playTime, id: gameObj.id });
                                    setShowEditModal(true);
                                }}>
                                    <FaEdit />
                                </Button>
                                <p></p>
                                <Button variant="danger" onClick={() => { if (window.confirm(`Are you sure you want to remove ${gameObj.game.name} from your library?`)) deleteGame(gameObj.id) }}><FaTrash /></Button>
                            </td>
                        </tr>
                    </tbody>
                )}
            </Table>
            <AddModal show={showAddModal} onHide={handleAddModalClose} userId={user.id} />
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
            <Button variant="secondary" onClick={() => setShowAddModal(true)}>Add New Game</Button>
            <AddModal show={showAddModal} onHide={handleAddModalClose} />
        </>
    );

}

export default Library;