import React from 'react'
import TimerForm from './TimerForm'

class ToggleableTimerForm extends React.Component {
  constructor () {
    super()

    this.state = {
      isOpen: false
    }
  }
  render () {
    if (this.state.isOpen) {
      return <TimerForm
                onFormSubmit={timer => {
                  this.props.onFormSubmit(timer)
                  this.setState({ isOpen: false })
                }}
                onFormClose={() => this.setState({ isOpen: false })}
              />
    } else {
      return (

          <button className="btn btn-large waves-effect waves-light hoverable blue accent-3" icon='plus'
            onClick={() => this.setState({ isOpen: true })}
          ><i className="material-icons">add</i></button>

      )
    }
  }
}

export default ToggleableTimerForm
