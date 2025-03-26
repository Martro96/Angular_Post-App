import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthDTO } from 'src/app/Auth/models/auth.dto';
import { SharedService } from 'src/app/Services/shared.service';

// Para el ejercicio 3:
// quitamos esto import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { login } from '../../actions/auth.actions';
import { AppState } from 'src/app/app.reducer';
import { select, Store } from '@ngrx/store';
import { selectAuthError, selectUserId } from '../../reducers/auth.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUser: AuthDTO;
  email: UntypedFormControl;
  password: UntypedFormControl;
  loginForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,

    private store: Store<AppState>, //Añado el estado de la app
    private router: Router
  ) {
    this.loginUser = new AuthDTO('', '', '', '');

    this.email = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {
    //Ahora aquí mostramos el feedback con managementToast igual que antes

    this.store.pipe(select(selectAuthError)).subscribe((error) => {
      if (error) {
        this.sharedService.managementToast('loginFeedback', false, error)
      }
    });
    this.store.pipe(select(selectUserId)).subscribe((userId) => {
      if (userId) {
        this.sharedService.managementToast('loginFeedback', true)
      }
    });

  }


  login (): void {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials = { 
      email: this.email.value,
      password: this.password.value
    };
    this.store.dispatch(login ({credentials}))
  }
}
