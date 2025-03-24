//Creo este archivo siguiendo la estructura del ejemplo teórico de la app TODO
import { AuthDTO } from "./Auth/models/auth.dto";

export interface AuthState {
    credentials: AuthDTO;
    loading: boolean;
    loaded: boolean;
    error: any;
}