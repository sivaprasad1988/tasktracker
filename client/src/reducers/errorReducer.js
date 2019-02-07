import { GET_ERRORS } from "../actions/types";
import uuid from 'uuid';

const initialState = {
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

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    default:
      console.log(state)
      return state;
  }
}
