import React from 'react'
import { Button } from 'semantic-ui-react'

const TimerActionButton = props => {
  if (props.timerIsRunning) {
    return (
      <Button
        as='div'
        attached='bottom'
        color='red'
        basic
        onClick={props.onStopClick}>
        Stop
      </Button>
    )
  } else {
    return (
      <Button
        as='div'
        attached='bottom'
        color='green'
        onClick={props.onStartClick}>
          <i className="material-icons">add</i>
      </Button>
    )
  }
}

export default TimerActionButton
