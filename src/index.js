import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import '../node_modules/bootstrap/dist/css/bootstrap-reboot.min.css';
import './index.css';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {AppContainer} from './containers/App';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';

const muiTheme = getMuiTheme({
    appBar: {
        height: 45,
    },
    "palette": {
        "primary1Color": "#1e88e5",
    },
    "textField": {
        "floatingLabelColor": "#8a8a8a",
        "borderColor": "#8a8a8a"
    },
    "dropDownMenu": {
        "accentColor": "#8a8a8a"
    }
});

ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <Router basename="/">
            <Route path=":data?" component={AppContainer}/>
        </Router>
    </MuiThemeProvider>,
    document.getElementById('root')
);
registerServiceWorker();
