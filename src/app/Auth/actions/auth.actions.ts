import { createAction, props } from '@ngrx/store';
import { AuthDTO } from '../models/auth.dto';


export const login = createAction(
    '[Auth] login', 
    props<{credentials: {
        email: string; 
        password: string
    }}> ()
);

export const loginSuccess = createAction(
    '[Auth] login success', 
    props<{ auth: AuthDTO } > ()
);

export const loginFailure = createAction(
    '[Auth] login Failure', 
    props<{ error: any } > ()
);

// LOGOUT
export const logout = createAction('[Auth] Logout');