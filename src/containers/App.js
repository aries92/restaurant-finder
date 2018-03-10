import React from 'react';
import AppBar from 'material-ui/AppBar';
import Map from './map/Map';
import {GoogleApiWrapper} from 'google-maps-react';
import './App.css';
import Divider from 'material-ui/Divider';
import SearchField from './search-field/SearchField';
import SortingField from './sorting-field/SortingField';
import Rating from './rating/Rating';
import Radius from './radius/Radius';
import OpenedNow from './opened-now/OpenedNow';
import cl from 'classnames';

class App extends React.Component {
    state = {
        isSidebarExpanded: true,
    };


    handleSidebarExpand = () => {
        this.setState({isSidebarExpanded: !this.state.isSidebarExpanded});
    };

    setMapInstance = (map) => {
        this.setState({map})
    }


    render() {
        const {isSidebarExpanded} = this.state;

        return (
            <div>
                <AppBar
                    title="Restaurant finder"
                    onLeftIconButtonClick={this.handleSidebarExpand}
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    className="AppBar"
                />
                {this.props.loaded ?
                    <main className="App">
                        <aside className={cl('sidebar', {expanded: isSidebarExpanded})}>
                            <div className="tab">
                                <SearchField
                                    map={this.state.map}
                                    google={this.props.google}
                                />
                            </div>
                            <Divider/>
                            <div className="tab">
                                <SortingField/>
                            </div>
                            <Divider/>
                            <div className="tab">
                                <Rating/>
                            </div>
                            <Divider/>
                            <div className="tab">
                                <OpenedNow />
                            </div>
                            <Divider/>
                            <div className="tab">
                                <Radius/>
                            </div>
                            <Divider/>
                        </aside>
                        <section className="map-container">
                            <Map
                                google={this.props.google}
                                handleMapInstance={this.setMapInstance}
                                isSidebarExpanded={isSidebarExpanded}
                            />
                        </section>
                    </main> :
                    'loading...'}
            </div>
        );
    }
}

export const AppContainer = (GoogleApiWrapper({
    apiKey: 'AIzaSyDgu8B_FH5TI_aBxfA1dPJ1OaTFJLPlOMI'
})(App))