import React, { useState } from 'react';

import { Navbar, Container, ButtonGroup, Button } from 'react-bootstrap';
import { ConnectModal } from './ConnectModal';

export function PshNavbar() {
    const [showConnectModal, setShowConnectModal] = useState(false);
    
    return (
        <>
            <Navbar variant="light">
                <Container fluid>
                    <Navbar.Brand>Peer Share</Navbar.Brand>
                    <ButtonGroup>
                        <Button variant='success' onClick={ () => setShowConnectModal(true) }>Connect</Button>
                        <Button variant='danger'>Reset</Button>
                    </ButtonGroup>
                </Container>
            </Navbar>
            { showConnectModal && <ConnectModal handleClose={() => setShowConnectModal(false) } /> }
        </>
    )
}