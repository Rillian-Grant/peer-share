import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { sendFile, selectPsh } from '../pshSlice';

import { Modal, Form, Button } from 'react-bootstrap';

export default function ShareModal(props: { handleClose: () => void}) {
    const psh = useAppSelector(selectPsh);
    const dispatch = useAppDispatch();

    const [fileName, setFileName] = useState("");
    const [text, setText] = useState("");

    return (
        <Modal show onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Share</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control type='text' placeholder="Name" value={fileName} onChange={e => setFileName(e.target.value)} />
                    <hr />
                    <Form.Control as="textarea" rows={3} placeholder='Contents' value={text} onChange={e => setText(e.target.value)} />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    dispatch(sendFile({
                        id: crypto.randomUUID(),
                        contents: text,
                        name: fileName || null
                    }))
                    props.handleClose()
                }}>Share</Button>
            </Modal.Footer>
        </Modal>
    )
}