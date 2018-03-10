import React, {Component} from 'react';
import Snackbar from 'material-ui/Snackbar';
import {withRouter } from 'react-router-dom'

class Message extends Component {
    render() {
        const {text} = this.props;
        const isOpen = !!text;
        return (
            <Snackbar
                open={isOpen}
                message={text}
                autoHideDuration={3000}
            />
        )
    }
}
export default withRouter(Message)