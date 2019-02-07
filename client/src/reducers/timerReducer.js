import {LOAD_TIMER_DATA} from "../actions/types";
import uuid from 'uuid';
const isEmpty = require("is-empty");

const initialState = {
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_TIMER_DATA:
            console.log('LOAD_TIMER_DATA');
            console.log(action);
            return {
                ...state,
                timers: action.payload,
            };
        default:
            return state;
    }
}
