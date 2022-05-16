import React, { useState } from "react";
import { Form, Button, Modal } from 'react-bootstrap';

function EditModal(props) {

    const [editedGameObj, setEditedGameObj] = useState({});

    return (<Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="editGameForm">
                    <Form.Label>Name</Form.Label>
                    <Form.Control placeholder={props.activeGame.game.name} disabled />
                    <Form.Label>Description</Form.Label>
                    <Form.Control placeholder={props.activeGame.game.description} disabled />
                    <Form.Label>Rating</Form.Label>
                    <Form.Control placeholder={props.activeGame.game.aggregatedRating} disabled />
                    <Form.Label>Release Date</Form.Label>
                    <Form.Control placeholder={props.activeGame.game.releaseDate} disabled />
                    <Form.Label>Status</Form.Label>
                    <Form.Select defaultValue={props.activeGame.gameStatus}
                        onChange={(e) => { editedGameObj.gameStatus = e.target.value }}>
                        <option>Playing</option>
                        <option>On Hold</option>
                        <option>Completed</option>
                        <option>Abandoned</option>
                        <option>Not Set</option>
                    </Form.Select>
                    <Form.Label>Hours Played</Form.Label>
                    <Form.Control placeholder={props.activeGame.playTime}
                        onChange={(e) => { editedGameObj.playTime = e.target.value * 60 }} />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
                Close
            </Button>
            <Button variant="primary" onClick={() => {
                props.updateGame(editedGameObj);
                setEditedGameObj({});
            }}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default EditModal;