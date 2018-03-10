import React, {Component} from 'react';
import Checkbox from 'material-ui/Checkbox';
import {withRouter} from "react-router-dom";
import queryString from 'query-string';

class Rating extends Component {

    state = {
        checked: []
    }

    _checkedArray = [];


    componentWillMount() {
        const qs = queryString.parse(this.props.location.search)
        let {rating} = qs;

        if (rating) {
            rating = rating.split(',').map(Number);
            this.setState({checked: rating})
        }
    }

    render() {
        return (
            <div>
                <p>Sort by rating</p>
                <Checkbox
                    label={<div className="star">&#9733;&#9733;&#9733;&#9733;&#9733;</div>}
                    onCheck={() => this.handleCheck(5)}
                    checked={this.state.checked.includes(5)}
                />
                <Checkbox
                    label={<div className="star">&#9733;&#9733;&#9733;&#9733;</div>}
                    onCheck={() => this.handleCheck(4)}
                    checked={this.state.checked.includes(4)}
                />
                <Checkbox
                    label={<div className="star">&#9733;&#9733;&#9733;</div>}
                    onCheck={() => this.handleCheck(3)}
                    checked={this.state.checked.includes(3)}
                />
                <Checkbox
                    label={<div className="star">&#9733;&#9733;</div>}
                    onCheck={() => this.handleCheck(2)}
                    checked={this.state.checked.includes(2)}
                />
                <Checkbox
                    label={<div className="star">&#9733;</div>}
                    onCheck={() => this.handleCheck(1)}
                    checked={this.state.checked.includes(1)}
                />
            </div>
        );
    }

    handleCheck = (id) => {
        if (!this._checkedArray.includes(id)) {
            this._checkedArray.push(id)
            this.setState({checked: this._checkedArray})
        } else {
            this._checkedArray = this._checkedArray.filter(item => item !== id)
            this.setState({checked: this._checkedArray})
        }

        this.setQuery(this._checkedArray)
    }

    setQuery = (rating) => {

        let qs = queryString.parse(this.props.location.search);

        if (rating.length > 0) {
            qs.rating = rating.toString();
        }

        if ((rating.length <= 0) && qs.rating) {
            delete qs.rating;
        }

        qs = queryString.stringify(qs);

        this.props.history.push({search: qs});
    }
}

Rating.propTypes = {};
Rating.defaultProps = {};


export default withRouter(Rating)
