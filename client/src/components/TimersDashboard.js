import React from 'react'
import { Grid } from 'semantic-ui-react'
import uuid from 'uuid'
import axios from 'axios'
import _ from 'lodash'
import PropTypes from "prop-types";



import EditableTimerList from './EditableTimerList'
import ToggleableTimerForm from './ToggleableTimerForm'
import { newTimer } from './helpers'
import { updateAll, createUrlWithParams, updateTrackOnStartOrStop } from './services';
import Filters from './Filters';
import {connect} from "react-redux";
import {trelloAppLoginCallback} from "../actions/authActions";
import {getDataForTimerDashBoard} from '../actions/timerAction';

var querystring = require('querystring');

class TimerDashboard extends React.Component {
  constructor () {
    super()
    this.queryJson = { runningSince: '', title: ''};
    this.state = {
      timers: [
        {
          title: '',
          description: '',
          elapsed: null,
          runningSince: null,
          id: uuid.v4(),
          updateDate: new Date().toISOString()
        }
      ]
    }
  };


  getData(that) {
    //If no data remains in db, put the two dummy data of state into the db
    axios.get('/getAll')
      .then(function(response) {
          let savedTimers = [];
          if(response.data.length === 0) {
            that.state.timers.forEach((timer)=>{
                axios.post('/insert',
                querystring.stringify(timer), {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  }
                }).then(function (response) {
                  timer.id = response.data.id
                  savedTimers.push(timer);
                  that.setState({timers: savedTimers});
              });
            });
          } else {
            that.saveDataToState(that, response.data)
          }
      });
  }

  componentDidMount() {
      //this.props.getDataForTimerDashBoard(this.props.timers);
      this.getData(this);
  }

  updateTimer (attrs) {
    this.setState({
      timers: this.state.timers.map(timer => {
        if (timer.id === attrs.id) {
          return Object.assign({}, timer, {
            title: attrs.title,
            description: attrs.description
          })
        } else {
          return timer
        }
      })
    })
  }

  createTimer (timer) {
    const t = newTimer(timer)
    this.setState({
      timers: this.state.timers.concat(t)
    })
  }

  deleteTimer (timerId) {
    axios.get('/delete?id='+timerId)
      .then((response) => {
        if(!response.data.name) {
          this.setState({
            timers: this.state.timers.filter(t => t.id !== timerId)
          });
        }
      }).catch((err) => {
        console.log(err)
      });
  }

  startTimer (timerId) {
    const now = Date.now()
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

  stopTimer (timerId) {
    const now = Date.now();
    let timers = this.state.timers.map(timer => {
      if (timer.id === timerId) {
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
      if(timer.id === timerId) {
        timerToUpdate = timer;
      }
    });
    if(timerToUpdate) updateTrackOnStartOrStop(timerToUpdate);
    this.setState({
      timers
    });
  }
  

  onQueryChange(query) {
    if(typeof(query)==='boolean') {
      if(query) {
        this.queryJson.runningSince = 'null';
      } else {
        this.queryJson.runningSince = '';
      }
    } else {
      this.queryJson.title = query;
    }
    let urlWithQuery = createUrlWithParams('/getAll?runningSince={runningSince}&title={title}', this.queryJson);
    axios.get(urlWithQuery)
    .then((response) => { 
      this.saveDataToState(this, response.data)
    });
  }

  saveDataToState(that, data) {
    let savedTimers = [];
    data.forEach((timer)=>{
      console.log(timer)
      savedTimers.push({
        title: timer.title, 
        description: timer.description, 
        id: timer._id || timer.id || uuid.v4(),
        elapsed: timer.elapsed || 0,
        runningSince: timer.runningSince || null,
        updateDate: timer.updateDate || new Date().toISOString()
      });
    });
    that.setState({timers: savedTimers});
  }

  render () {
    const onQueryChange = _.debounce((query)=>{this.onQueryChange(query)}, 400);
    return (
      <div className="container">
          <div className="row">
              <EditableTimerList
                  timers={this.state.timers}
                  onFormSubmit={attrs => this.updateTimer(attrs)}
                  onTrashClick={timerId => this.deleteTimer(timerId)}
                  onStartClick={timerId => this.startTimer(timerId)}
                  onStopClick={timerId => this.stopTimer(timerId)}
              />
              <ToggleableTimerForm
                  onFormSubmit={timer => this.createTimer(timer)}
              />
              <Filters
                  onTextChange={(query)=>{onQueryChange(query)}}
                  onCheckboxChange={(query)=>{this.onQueryChange(query)}}
              />
          </div>
      </div>
    )
  }
}


TimerDashboard.propTypes = {
    getDataForTimerDashBoard: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    timers: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
    timers: state.timers
});

export default connect(
    mapStateToProps,
    {getDataForTimerDashBoard}
)(TimerDashboard);
