import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import Toggle from 'material-ui/Toggle';
import queryString from "query-string";

class OpenedNow extends Component {
    state = {
        checked: false
    }

    componentWillMount() {
        const qs = queryString.parse(this.props.location.search)
        const {opened} = qs;
        if (+opened > 0) {
            this.setState({checked: true})
        } else {
            this.setState({checked: false})
        }
    }
    render() {
        return (
            <div>
                <Toggle
                    label="Is opened now ?"
                    toggled={this.state.checked}
                    onToggle={this.handleToggle}
                />
            </div>
        );
    }

    handleToggle = (e, checked) => {
        this.setState({checked})
        this.setQuery(checked)
    }

    setQuery = (opened) => {
        let qs = queryString.parse(this.props.location.search);

        if (opened) {
            qs.opened = 1;
        }

        if ((!opened) && qs.opened) {
            delete qs.opened;
        }

        qs = queryString.stringify(qs);

        this.props.history.push({search: qs});
    }
}

OpenedNow.propTypes = {};
OpenedNow.defaultProps = {};

export default withRouter(OpenedNow);