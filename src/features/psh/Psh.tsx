import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setupPeer, selectPsh, connectPeer, sendData, Data } from './pshSlice';

export function Psh() {
    const peer = useAppSelector(selectPsh);
    const dispatch = useAppDispatch();
    const [peerId, setPeerId] = useState('');

    const testData: Data = {
        log: "Test log from peer: " + peer.id,
    }
    return (
        <>
            <p>Peer info: {peer.status === "ready" ? peer.id : peer.status}</p>
            <button onClick={() => dispatch(setupPeer())}>Setup</button>
            <input type="text" id="peerId" onChange={e => setPeerId(e.target.value)} value={peerId} />
            <button onClick={() => dispatch(connectPeer(peerId))}>Connect</button>
            <button onClick={() => dispatch(sendData(testData))}>Send</button>
        </>
    )
}