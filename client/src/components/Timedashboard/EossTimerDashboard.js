import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserTimeSheet} from "../../actions/timerAction";
import EossEditableTimerList from './EossEditableTimerList'


class EossTimerDashboard extends Component {
    constructor(){
        super();
    }
    componentDidMount(){
        this.props.getUserTimeSheet();
    }
    render() {
        const {user} = this.props.auth;
        const timerInfo = this.props.timers.timers;
        console.log(timerInfo);

        return (
            <div>
                <EossEditableTimerList timerInfo={timerInfo} />
            </div>
        )
    }
}

EossTimerDashboard.propTypes = {
    getUserTimeSheet: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    timers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    timers: state.timers
});

export default connect(
    mapStateToProps,
    {getUserTimeSheet}
)(EossTimerDashboard);
