import React from 'react'
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FaQuestionCircle } from 'react-icons/fa';

export default function NotFoundToolTip() {

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Sorry, we couldn't find the full information for this game 😔
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
        >
            <span><h4 style={{ textAlign: 'center', color: 'coral' }}><FaQuestionCircle /></h4></span>
        </OverlayTrigger >

    );
}
