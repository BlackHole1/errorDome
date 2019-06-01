import url from "../../utils/url";
import { FETCH_DATA } from "../middleware/api";
import { schema as userSchema } from "./entities/user";


const initialState = {
    username: localStorage.getItem('username') || '',
    password: '',
    isFetching: false,
    // 登录态标识
    status: localStorage.getItem('login') || false
};

// action types
export const types = {
    LOGIN_REQUEST: "LOGIN/LOGIN_REQUEST",
    LOGIN_SUCCESS: "LOGIN/LOGIN_SUCCESS",
    LOGIN_FAILURE: "LOGIN/LOGIN_FAILURE",
    LOGOUT: "LOGIN/LOGOUT",
    SET_USERNAME: "LOGIN/SET_USERNAME",
    SET_PASSWORD: "LOGIN/SET_PASSWORD"
};

// action creators
export const actions = {
    // 异步action，执行登录
    login: () => {
        return (dispatch, getState) => {
            const { username, password } = getState().login;
            const data = {
              username,
              password
            };
            if (!(username && username.length > 0 && password && password.length > 0)) {
                return dispatch(loginFailure("用户名和密码不能为空！"));
            }

            const endpoint = url.postUser();
            console.log(data);
            console.log(fetchUser(endpoint, data));
            return dispatch(fetchUser(endpoint, data));
        };
    },
    logout: () => {
        localStorage.removeItem('username');
        localStorage.removeItem('login');
        return {
            type: types.LOGOUT
        };
    },

    setUsername: username => ({
        type: types.SET_USERNAME,
        username
    }),

    setPassword: password => ({
        type: types.SET_PASSWORD,
        password
    })
};


const fetchUser = (endpoint, data) => ({
    [FETCH_DATA]: {
        types: [
            types.LOGIN_REQUEST,
            types.LOGIN_SUCCESS,
            types.LOGIN_FAILURE
        ],
        endpoint,
        schema: userSchema,
        data
    }
});

const loginFailure = error => ({
    type: types.LOGIN_FAILURE,
    error
});

// reducer
const reducer = (state = initialState, action) => {
    switch(action.type) {
        case types.LOGIN_REQUEST:
            return { ...state, isFetching: true };
        case types.LOGIN_SUCCESS:
            return { ...state, isFetching: false, status: true };
        case types.LOGIN_FAILURE:
            return { ...state, isFetching: false };
        case types.LOGOUT:
            return { ...state,status: false, username: "", password: "" };
        case types.SET_USERNAME:
            return { ...state,username: action.username };
        case types.SET_PASSWORD:
            return { ...state, password: action.password };
        default:
            return state;
    }
};

export default reducer;

// selectors
export const getUsername = (state) => state.login.username;

export const getPassword = (state) => state.login.password;

export const isLogin = state => state.login.status;

