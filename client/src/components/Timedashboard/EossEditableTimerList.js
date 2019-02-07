import React from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import EditableTimer from '../../components/EditableTimer';

/*const EditableTimerList = props => (

  <div className="timer-main-container">
    {props.timers.map(timer => (
      <EditableTimer
        key={timer.id}
        {...timer}
        onFormSubmit={props.onFormSubmit}
        onTrashClick={props.onTrashClick}
        onStartClick={props.onStartClick}
        onStopClick={props.onStopClick}
      />
    ))}
  </div>
)
 */

class EossEditableTimerList extends React.Component {
  constructor(){
      super();
  }
  
  render() {
    const timerInfo = this.props.timers.timers;
      const trackList = timerInfo && timerInfo.length ? (
        <div className="ui five cards">
            { timerInfo.map(timer => 
            <EditableTimer key={timer._id}
            {...timer} />      
              )}
        </div>
    ) : '';

    
      
      return (
        <div className="timer-main-container">{trackList}</div>
      )
  }
  
}

const mapStateToProps = state => ({
  auth: state.auth,
  timers: state.timers
});

export default connect(
  mapStateToProps,
  {}
)(EossEditableTimerList);