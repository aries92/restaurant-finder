import React from "react";
import {withRouter} from "react-router-dom";
import queryString from "query-string";


class SearchField extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        if (this.props.map !== prevProps.map) {
            this.initSearchField()
        }
    }

    render() {
        return (
            <input type="text"
                   ref="pacInput"
                   className="autocomplete"
                   required
            />
        );
    }

    initSearchField = () => {
        const {google, map} = this.props;
        const options = {
            types: ['(cities)']
        }

        const autocomplete = new google.maps.places.Autocomplete(this.refs.pacInput, options);
        autocomplete.bindTo('bounds', map);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }
            this.setQuery(place);

        })
    }

    setQuery = (place) => {
        let query = queryString.parse(this.props.location.search);

        query.lat = place.geometry.location.lat();
        query.lng = place.geometry.location.lng();

        query = queryString.stringify(query);
        this.props.history.push({search: query});
    }
}

export default withRouter(SearchField)