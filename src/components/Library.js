import React, {useState, useEffect} from "react";
import axios from "axios";
import { render } from "@testing-library/react";

function Library() {
    const [loading, setLoading] = useState(false);
    const [gamesList, setGamesList] = useState({});
    
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/game/steam`)
        .then(res => setGamesList(res.data.response.games));
        setLoading(false);
    }, []);

    if (loading) return <h3>Loading</h3>
    return(
        <pre>{JSON.stringify(gamesList)}(</pre>
    );

}

export default Library;