import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.reducer";

export const selectAuthState = (state: AppState) => state.auth;
export const selectUserId = createSelector(
    selectAuthState,
    (authState) => authState.credentials.user_id
); 

export const selectAccessToken = createSelector(
    selectAuthState, 
    (authState) => authState.credentials.access_token
)