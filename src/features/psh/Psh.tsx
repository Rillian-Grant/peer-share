import React, { useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { PshNavbar } from './components/PshNavbar';
import { setupPeer, selectPsh, connectPeer, sendFile, Data } from './pshSlice';

import { Nav, Container } from "react-bootstrap";
import PeerTable from './components/PeerTable';
import Files from './components/Files';

export function Psh() {
    const peer = useAppSelector(selectPsh);
    const dispatch = useAppDispatch();
    const [tab, setTab] = useState("share");

    // TODO: Check
    useEffect(() => {
        dispatch(setupPeer());
    }, []);

    const testData: Data = {
        log: "Test log from peer: " + peer.id,
    }
    /* return (
        <>
            <p>Peer info: {peer.status === "ready" ? peer.id : peer.status}</p>
            <button onClick={() => dispatch(setupPeer())}>Setup</button>
            <input type="text" id="peerId" onChange={e => setPeerId(e.target.value)} value={peerId} />
            <button onClick={() => dispatch(connectPeer(peerId))}>Connect</button>
            <button onClick={() => dispatch(sendData(testData))}>Send</button>
        </>
    ) */
    if (peer.status !== "ready") return <>{peer.status}</>
    else return (
        <>
            <PshNavbar />
            <Container>
                <Nav variant="tabs" activeKey={tab} onSelect={key => setTab(key || "share")}>
                    <Nav.Item>
                        <Nav.Link eventKey="share">Share</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="peers">Peers</Nav.Link>
                    </Nav.Item>
                </Nav>
                { tab === "peers" && <PeerTable /> }
                { tab === "share" && <Files /> }
            </Container>
        </>
    )
}