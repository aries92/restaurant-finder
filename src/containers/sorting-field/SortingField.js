import React from "react";
import {withRouter} from "react-router-dom";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import queryString from 'query-string';

const type = [
    'restaurant',
    'cafe',
    'bar',
    'bakery',
    'casino',
    'night_club',
    'meal_takeaway',
];


class SortingField extends React.Component {
    state = {
        type: '',
    }

    componentWillMount() {
        const qs = queryString.parse(this.props.location.search)
        const {type} = qs;
        if (type) {
            this.setState({type})
        } else {
            this.setState({type: 'restaurant'})
        }
    }

    render() {
        const {type} = this.state;
        return (
            <SelectField
                multiple={false}
                floatingLabelText="Sort by type"
                value={type}
                onChange={this.handleChange}
                fullWidth={true}
            >
                {this.menuItems()}
            </SelectField>
        );
    }

    handleChange = (event, index, type) => {
        this.setState({type});
        this.setQuery(type)

    }

    menuItems = () => {
        return type.map((type) => (
            <MenuItem
                key={type}
                insetChildren={true}
                value={type}
                primaryText={type}
            />
        ));
    }

    setQuery = (type) => {
        let qs = queryString.parse(this.props.location.search);

        if (type.length > 0) {
            qs.type = type.toString();
        }

        if ((type.length <= 0) && qs.type) {
            delete qs.type;
        }

        qs = queryString.stringify(qs);

        this.props.history.push({search: qs});
    }
}

export default withRouter(SortingField)