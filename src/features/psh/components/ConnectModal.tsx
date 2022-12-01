import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { setupPeer, selectPsh, connectPeer, sendData, Data } from '../pshSlice';

import { Modal, Form, Button } from 'react-bootstrap';

export function ConnectModal(props: { handleClose: () => void}) {
    const psh = useAppSelector(selectPsh);
    const dispatch = useAppDispatch();

    const [peerID, setPeerID] = useState("");

    return (
        <Modal show onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Connect Peer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>This Peer's ID: <code>{psh.id}</code></p>
                <Form>
                    <Form.Label>Connect to: </Form.Label>
                    <Form.Control type="text" placeholder='Peer ID' value={peerID} onChange={e => setPeerID(e.target.value)} />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    dispatch(connectPeer(peerID))
                    props.handleClose()
                }}>Connect</Button>
            </Modal.Footer>
        </Modal>
    )
}