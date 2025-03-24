import { createReducer, on } from "@ngrx/store";
import { AuthDTO } from "../models/auth.dto";
import { login, loginFailure, loginSuccess, logout } from "../actions/auth.actions";

//Me traigo la interfaz y la defino aqui para controlar sólo esta
export interface AuthState {
    credentials: AuthDTO;
    loading: boolean;
    loaded: boolean;
    error: any;
}

export const InitialState: AuthState = {
    credentials: {
        email: '',
        password: '',
        user_id: '',
        access_token: '',
    }, 
    loading: false, 
    loaded: false,
    error: null,
};

export const authReducer = createReducer(
    InitialState, 
    on (login, (state) => ({
        ...state,
        loading: true,
        loaded: false,
        error: null,
    })),
    on (loginSuccess, (state, {auth}) => ({
        ...state,
        credentials: auth, 
        loading: false, 
        loaded: true,
        error: null,
    })), 
    on (loginFailure, (state, {error}) => ({
        ...state,
        loading: false, 
        loaded: false,
        error: error,
    })), 

    on (logout, () => InitialState ),

)