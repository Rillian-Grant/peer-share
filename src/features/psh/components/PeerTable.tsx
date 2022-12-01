import React from "react";
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { setupPeer, selectPsh, connectPeer, sendData, Data } from '../pshSlice';

import { Table } from "react-bootstrap";

export default function PeerTable() {
    const psh = useAppSelector(selectPsh);

    return (
        <Table>
            <thead>
                <tr>
                    <th>Peer ID</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {psh.peers.map(peer => (
                    <tr key={peer.id}>
                        <td>{peer.id}</td>
                        <td>{peer.status}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}