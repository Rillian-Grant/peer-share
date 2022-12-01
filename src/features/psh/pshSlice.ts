import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import Peer, { DataConnection } from "peerjs"
import { AppThunk, RootState, store } from "../../app/store"

var peer: Peer | null = null;
var peer_connection_objects: { [id: string]: DataConnection } = {};

export interface Data {
    log?: string,
    peerData?: { id: string }[]
}

export interface PshState {
    id: string | null,
    status: "ready" | "loading" | "off" | "error"
    peers: {
        id: string,
        status: "ready" | "loading" | "error"
    }[]
    data: Data[]
}

const initialState: PshState = {
    id: null,
    status: "off",
    peers: [],
    data: []
}

export const setupPeer = (id: string | undefined = undefined): AppThunk => (dispatch, getState) => {
    dispatch(peerLoading());
    if (id) peer = new Peer(id);
    else peer = new Peer();
    peer.on("open", id => dispatch(peerReady(id)))
    peer.on("error", err => dispatch(peerError(err.toString())))
    peer.on("connection", conn => {
        console.log("Connection established from peer: ", conn.peer)
        peer_connection_objects[conn.peer] = conn;
        dispatch(connectionReady(conn.peer))

        conn.on("data", data => dispatch(parseData(data)))
        conn.on("close", () => dispatch(connectionRemove(conn.peer)))

        sendPeerList(conn);
    })
}

const sendPeerList = (connection: DataConnection) => {
    console.log("Sending following peer list to peer: ", connection.peer)
    var psh = store.getState().psh;
    // Send peer data
    const peerList = psh.peers.map(p => p.id).filter(id => id !== psh.id && id !== connection.peer).map(id => ({ id }))

    var payload: Data = {
        peerData: peerList
    }
    console.log(payload)
    connection.send(payload)
}

export const connectPeer = (id: string): AppThunk => (dispatch, getState) => {
    var psh = getState().psh;
    console.log("Connecting to peer: ", id)

    if (psh.status !== "ready") {
        console.error("Peer not ready");
        return;
    }

    if (psh.peers.find(peer => peer.id === id)) {
        console.log("Already connected/connecting to peer: ", id);
        return;
    }

    dispatch(connectionLoading(id));
    const connection = peer!.connect(id);
    connection.on("open", () => {
        console.log("Connected to peer: ", connection.peer)
        connection.on("data", data => dispatch(parseData(data)))

        dispatch(connectionReady(id))

        sendPeerList(connection);
    })

    connection.on("error", err => {
        dispatch(connectionError(id));
        console.error(err);
    })

    peer_connection_objects[id] = connection;
}

const parseData = (data: any): AppThunk => (dispatch, getState) => {
    console.log("Parsing data:")
    console.log(data)
    if ("log" in data) {
        console.log(data.log);
    }

    if ("peerData" in data) {
        console.log("Received peer list")
        data.peerData.map((peerData: { id: string }) => peerData.id).forEach((id: string) => {
            dispatch(connectPeer(id))
        })
        console.log("Finished processing peer list")
    }

    dispatch(receiveData(data));
}

export const sendData = (data: Data): AppThunk => (dispatch, getState) => {
    var psh = getState().psh;
    psh.peers.map(peer => peer.id).map(id => peer_connection_objects[id]).forEach(conn => {
        conn.send(data);
    });
}

export const pshSlice = createSlice({
    name: "psh",
    initialState,
    reducers: {
        peerLoading: state => {
            state.id = null;
            state.status = "loading";
        },
        peerReady: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
            state.status = "ready";
        },
        peerError: (state, action: PayloadAction<string>) => {
            state.id = null;
            state.status = "error";
            // TODO: Handle error
            console.log(action.payload);
        },
        peerOff: state => {
            state.id = null;
            state.status = "off";
        },
        connectionLoading: (state, action: PayloadAction<string>) => {
            if (state.peers.find(peer => peer.id === action.payload)) {
                state.peers.find(peer => peer.id === action.payload)!.status = "loading";
            } else {
                state.peers.push({
                    id: action.payload,
                    status: "loading"
                })
            }
        },
        connectionReady: (state, action: PayloadAction<string>) => {
            if (state.peers.find(peer => peer.id === action.payload)) {
                state.peers.find(peer => peer.id === action.payload)!.status = "ready";
            } else {
                // TODO: This shouldn't be needed. Find a better way to handle this.
                state.peers.push({
                    id: action.payload,
                    status: "ready"
                })
            }
        },
        // TODO: Consider adding a connectionClose action. check firefox support
        connectionError: (state, action: PayloadAction<string>) => {
            if (state.peers.find(peer => peer.id === action.payload)) {
                state.peers.find(peer => peer.id === action.payload)!.status = "error";
            } else {
                // TODO: This shouldn't be needed. Find a better way to handle this.
                state.peers.push({
                    id: action.payload,
                    status: "error"
                })
            }
        },
        connectionRemove: (state, action: PayloadAction<string>) => {
            state.peers = state.peers.filter(peer => peer.id !== action.payload);
        },
        receiveData: (state, action: PayloadAction<Data>) => {
            state.data.push(action.payload);
        }
    }
})

const { peerLoading, peerReady, peerError, peerOff, connectionLoading, connectionReady, connectionError, connectionRemove, receiveData } = pshSlice.actions

export const selectPsh = (state: RootState) => state.psh // TODO: Check if needed

export default pshSlice.reducer