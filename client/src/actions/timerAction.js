import axios from "axios";
import jwt_decode from "jwt-decode";

import {GET_ERRORS, LOAD_TIMER_DATA} from "./types";

var querystring = require('querystring');


// Register User
export const getDataForTimerDashBoard = (timerData) => dispatch => {
    console.log("FUCKING HERE")
    const token = localStorage.getItem("jwtToken");
    const decoded = jwt_decode(token);
    //If no data remains in db, put the two dummy data of state into the db
    axios.get('/getAll').then(function (response) {
        console.log("FUCKING HERE INSIDE AXIOS")
        let savedTimers = [];
        if (response.data.length === 0) {
            timerData.timers.forEach((timer) => {
                axios.post('/insert',
                    querystring.stringify(timer), {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }).then(function (response) {
                    timer.id = response.data.id
                    savedTimers.push(timer);

                    dispatch({
                        type: LOAD_TIMER_DATA,
                        payload: decoded,
                        timers: savedTimers
                    })
                }).catch(err => {
                    dispatch({
                        type: GET_ERRORS,
                        payload: err.response.data
                    })
                });
            });
        } else {
            console.log(response.data)
            dispatch({
                type: LOAD_TIMER_DATA,
                payload: decoded,
                timers: response.data
            })
        }
    });
};


export const getUserTimeSheet = () => dispatch => {
    axios.get('/getAll').then(function (response) {
        console.log(response.data)
            dispatch({
                type: LOAD_TIMER_DATA,
                payload: response.data,
            })
    });
};