import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {trelloAppLoginCallback} from "../../actions/authActions";
import classnames from "classnames";
import { matchPath } from 'react-router';
import querySearch from "stringquery";


class TrelloLoginCallBack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }

    componentDidMount() {
        console.log(this.props.auth.user);
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push("/login");
        }else{
            const queryString = querySearch(this.props.history.location.search);
            this.props.trelloAppLoginCallback(queryString);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            //   this.props.history.push("/dashboard");
        }

        if (nextProps.errors) {
            console.log(nextProps)
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };

    render() {
        const {errors} = this.state;

        return (
            <div className="container">
                <div style={{marginTop: "4rem"}} className="row">
                    <div className="col s8 offset-s2">
                        <Link to="/" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> Back to
                            home
                        </Link>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.email || errors.emailnotfound
                                    })}
                                />
                                <label htmlFor="email">Trello API key</label>
                                <span className="red-text">
                  {errors.email}
                                    {errors.emailnotfound}
                </span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id="password"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.password || errors.passwordincorrect
                                    })}
                                />
                                <label htmlFor="password">Trello API Token</label>
                                <span className="red-text">
                  {errors.notoken}
                                    {errors.passwordincorrect}
                </span>
                            </div>
                            <div className="col s12" style={{paddingLeft: "11.250px"}}>
                                <button
                                    style={{
                                        width: "150px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem"
                                    }}
                                    type="submit"
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                    Trello Login
                                </button>
                                <span className="red-text">
                  {errors.password}
                                    {errors.passwordincorrect}
                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

TrelloLoginCallBack.propTypes = {
    trelloAppLoginCallback: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {trelloAppLoginCallback}
)(TrelloLoginCallBack);
