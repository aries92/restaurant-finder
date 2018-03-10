import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import Slider from 'material-ui/Slider';
import queryString from "query-string";

import debounce from 'debounce';

class Radius extends Component {
    state = {
        radius: 0
    }

    componentWillMount() {
        const qs = queryString.parse(this.props.location.search)
        const {radius} = qs;
        if (radius) {
            this.setState({radius: +radius})
        }
    }

    render() {
        const {radius} = this.state;
                return (
            <div>
                <p>Sort by radius {radius > 0 ? <b>{radius}m</b> : ''}</p>
                <Slider
                    defaultValue={0}
                    className="slider"
                    min={0}
                    max={5000}
                    step={1}
                    value={this.state.radius}
                    onChange={this.handleSlider}
                />
            </div>
        );
    }

    handleSlider = (event, value) => {
        this.setState({radius: value});
        this.setQuery(value)
    }

    setQuery = debounce((radius) => {
        let qs = queryString.parse(this.props.location.search);

        if (radius > 0) {
            qs.radius = radius.toString();
        }

        if ((radius <= 0) && qs.radius) {
            delete qs.radius;
        }

        qs = queryString.stringify(qs);

        this.props.history.push({search: qs});
    },400)
}

Radius.propTypes = {};
Radius.defaultProps = {};

export default withRouter(Radius);
