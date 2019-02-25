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

    stopTimer (timerId) {
        const now = Date.now();
        let timers = this.props.timers.timers.map(timer => {
        if (timer._id === timerId) {
        const lastElapsed = now-timer.runningSince
        return Object.assign({}, timer, {
          elapsed: timer.elapsed + lastElapsed,
          runningSince: null,
          updateDate: new Date().toISOString()
        })
      } else {
        return timer
      }
    });
    let timerToUpdate = null;
    timers.forEach(timer => {
      if(timer._id === timerId) {
        timerToUpdate = timer;
      }
    });
    if(timerToUpdate) updateTrackOnStartOrStop(timerToUpdate);
        this.setState({
          timers
        });
    }
    startTimer (timerId) {
        const now = Date.now()
        let timers = this.props.timers.timers.map(timer => {
            if (timer._id === timerId) {
                alert(timer._id);
                return Object.assign({}, timer, {
                    runningSince: now,
                    updateDate: new Date().toISOString()
                })
            } else {
                return timer
            }
        });
        let timerToUpdate = null;
        console.log(timers);

        timers.forEach(timer => {
            if(timer._id === timerId) {
                timerToUpdate = timer;
            }
        });
        if(timerToUpdate){
            updateTrackOnStartOrStop(timerToUpdate);
        }
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
                    onStopClick={timerId => this.stopTimer(timerId)}
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
