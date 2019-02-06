import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import redirectUserToTrello from '../utils/redirectUserToTrello';
import jwt_decode from "jwt-decode";

import {GET_ERRORS, SET_CURRENT_USER, USER_LOADING} from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post("/api/users/register", userData)
        .then(res => history.push("/login"))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Login - get user token
export const loginUser = userData => dispatch => {
    axios
        .post("/api/users/login", userData)
        .then(res => {
            // Save to localStorage

            // Set token to localStorage
            const {token} = res.data;
            localStorage.setItem("jwtToken", token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// User loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};


// Login - get user token
export const trelloAppLogin =  userData => dispatch => {
    const token = localStorage.getItem("jwtToken");
    const decoded = jwt_decode(token);
    userData.userid = decoded.id;

    axios.post("api/trello/getCardDetails", userData).then(res => {
            const {url} = res.data.url;
            dispatch(redirectUserToTrello(res.data.url));
        }).catch(err => {
            if (err.response) {
                dispatch({
                    type: GET_ERRORS,
                    payload: (err.response.data) ? err.response.data : ''
                })
            }
        }
    );
};


export const trelloAppLoginCallback = (queryString) => dispatch => {
    const token = localStorage.getItem("jwtToken");
    const decoded = jwt_decode(token);
    const userData = {};
    userData.userid = decoded.id;
    userData.oauth_token = queryString.oauth_token;
    userData.oauth_verifier = queryString.oauth_verifier;


    axios.post("api/trello/getAccessTokens", userData).then(res => {
        const {url} = res.data.url;

        //dispatch(redirectUserToTrello(res.data.url));
    }).catch(err => {
            if (err.response) {
                dispatch({
                    type: GET_ERRORS,
                    payload: (err.response.data) ? err.response.data : ''
                })
            }
        }
    );
};