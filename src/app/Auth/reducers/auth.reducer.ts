import { createReducer, on } from "@ngrx/store";
import { AuthDTO } from "../models/auth.dto";
import { AuthState } from "src/app/app.reducer";
import { login, loginFailure, loginSuccess, logout } from "../actions/auth.actions";
import { Action } from "rxjs/internal/scheduler/Action";
import { state } from "@angular/animations";

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