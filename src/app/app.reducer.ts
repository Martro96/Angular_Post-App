//Creo este archivo siguiendo la estructura del ejemplo teórico de la app TODO
import { AuthState } from "./Auth/reducers/auth.reducer";

export interface AppState {
    auth: AuthState;
}
// Esto lo llevo a auth.reducer y dejo sólo AppState que recoge todo lo de AuthState
// export interface AuthState {
//     credentials: AuthDTO;
//     loading: boolean;
//     loaded: boolean;
//     error: any;
// }