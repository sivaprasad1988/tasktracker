import {LOAD_TIMER_DATA} from "../actions/types";
import uuid from 'uuid';
const isEmpty = require("is-empty");

const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false,
    timers: [{
            title: '',
            description: '',
            elapsed: null,
            runningSince: null,
            id: uuid.v4(),
            updateDate: new Date().toISOString()
        }
    ]
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_TIMER_DATA:
            console.log('LOAD_TIMER_DATA');
            console.log(action);
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload,
                timers: action.timer
            };
        default:
            return state;
    }
}
