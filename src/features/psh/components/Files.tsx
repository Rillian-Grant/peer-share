import React, { useState } from "react";

import { Button, Accordion, ButtonGroup } from "react-bootstrap";

import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { setupPeer, selectPsh, connectPeer, sendFile, Data, File } from '../pshSlice';
import ShareModal from "./ShareModal";

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

// TODO: Lots of issues
function uploadFile(callback: (file: File) => void) {
    var input = document.createElement('input');
    input.type = 'file';

    input?.addEventListener('change', event => {
        const target = event.target as HTMLInputElement;
        const file = target!.files![0];

        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = readerEvent => {
            var contents: string = readerEvent!.target!.result! as string; // this is the content!
            
            callback({
                name: file.name,
                contents,
                id: crypto.randomUUID()
            })
        }
    })

    input.click();
}

export default function Files() {
    const psh = useAppSelector(selectPsh);
    const dispatch = useAppDispatch();
    
    const [selectedFile, setSelectedFile] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);

    return (
        <>
            {/* <Button variant="none" className="fs-4" onClick={() => setShowShareModal(true)}>+</Button> */}
            <ButtonGroup>
                <Button onClick={() => {
                    navigator.clipboard.readText().then((clipText) => {
                        dispatch(sendFile({
                            name: "paste.txt",
                            contents: clipText,
                            id: crypto.randomUUID()
                        }))
                    });
                }}>Paste</Button>
                <Button variant="secondary" onClick={() => uploadFile(file => dispatch(sendFile(file)))}>Upload</Button>
            </ButtonGroup>
            <Accordion defaultActiveKey={selectedFile} onSelect={key => setSelectedFile(key as string)}>
                {psh.files.map(file => (
                    <Accordion.Item eventKey={file.id} key={file.id}>
                        <Accordion.Header>{ file.name || "---" } | { formatBytes(new Blob([file.contents]).size) }</Accordion.Header>
                        <Accordion.Body><pre>{ file.contents }</pre></Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
            {/* {showShareModal && <ShareModal handleClose={() => setShowShareModal(false)} />} */}
        </>
    )
}