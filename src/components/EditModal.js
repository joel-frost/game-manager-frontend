import React, { useState } from "react";
import { Form, Button, Modal } from 'react-bootstrap';

function EditModal(props) {

    const [editedGame, setEditedGame] = useState({});

    return (<Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="editGameForm">
                    <Form.Label>Name</Form.Label>
                    <Form.Control placeholder={props.activeGame.name}
                        onChange={(e) => { editedGame.name = e.target.value }} />
                    <Form.Label>Description</Form.Label>
                    <Form.Control placeholder={props.activeGame.description}
                        onChange={(e) => { editedGame.description = e.target.value }} />
                    <Form.Label>Rating</Form.Label>
                    <Form.Control placeholder={props.activeGame.aggregatedRating} disabled />
                    <Form.Label>Release Date</Form.Label>
                    <Form.Control placeholder={props.activeGame.releaseDate} disabled />
                    <Form.Label>Status</Form.Label>
                    <Form.Select defaultValue={props.activeGame.gameStatus}
                        onChange={(e) => { editedGame.gameStatus = e.target.value }}>
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
            <Button variant="secondary" onClick={props.onHide}>
                Close
            </Button>
            {/* TODO make this button add game to backend */}
            <Button variant="primary" onClick={() => {
                props.updateGame(editedGame);
                setEditedGame({});
            }}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default EditModal;