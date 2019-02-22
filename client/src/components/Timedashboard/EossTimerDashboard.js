import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserTimeSheet} from "../../actions/timerAction";
import EossEditableTimerList from './EossEditableTimerList'
import {updateTrackOnStartOrStop} from "../services";


class EossTimerDashboard extends Component {
    constructor(){
        super();
    }
    componentDidMount(){
        this.props.getUserTimeSheet();
    }
    startTimer (timerId) {
        const now = Date.now()
        alert(timerId);
        console.log(this.props)
        let timers = this.state.timers.map(timer => {
            if (timer.id === timerId) {
                return Object.assign({}, timer, {
                    runningSince: now,
                    updateDate: new Date().toISOString()
                })
            } else {
                return timer
            }
        });
        let timerToUpdate = null;
        timers.forEach(timer => {
            if(timer.id === timerId) {
                timerToUpdate = timer;
            }
        });
        if(timerToUpdate) updateTrackOnStartOrStop(timerToUpdate);
        this.setState({
            timers
        })
    }

    render() {
        const {user} = this.props.auth;
        const timerInfo = this.props.timers.timers;


        return (
            <div>
                <EossEditableTimerList
                    timerInfo={timerInfo}
                    onStartClick={timerId => this.startTimer(timerId)}
                />
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
