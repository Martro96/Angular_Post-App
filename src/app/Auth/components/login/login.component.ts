import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthDTO } from 'src/app/Auth/models/auth.dto';
// import { HeaderMenus } from 'src/app/Models/header-menus.dto';
// import { AuthService } from 'src/app/Services/auth.service';
// import { HeaderMenusService } from 'src/app/Services/header-menus.service';
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
    // private authService: AuthService,
    private sharedService: SharedService,
    // private headerMenusService: HeaderMenusService,
    // private localStorageService: LocalStorageService,
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

  // async login(): Promise<void> {
  //   let responseOK: boolean = false;
  //   let errorResponse: any;

  //   this.loginUser.email = this.email.value;
  //   this.loginUser.password = this.password.value;
  //   try {
  //     const authToken = await this.authService.login(this.loginUser);
  //     responseOK = true;
  //     this.loginUser.user_id = authToken.user_id;
  //     this.loginUser.access_token = authToken.access_token;
  //     // save token to localstorage for next requests
  //     this.localStorageService.set('user_id', this.loginUser.user_id);
  //     this.localStorageService.set('access_token', this.loginUser.access_token);
  //   } catch (error: any) {
  //     responseOK = false;
  //     errorResponse = error.error;
  //     const headerInfo: HeaderMenus = {
  //       showAuthSection: false,
  //       showNoAuthSection: true,
  //     };
  //     this.headerMenusService.headerManagement.next(headerInfo);

  //     this.sharedService.errorLog(error.error);
  //   }

  //   await this.sharedService.managementToast(
  //     'loginFeedback',
  //     responseOK,
  //     errorResponse
  //   );

  //   if (responseOK) {
  //     const headerInfo: HeaderMenus = {
  //       showAuthSection: true,
  //       showNoAuthSection: false,
  //     };
  //     // update options menu
  //     this.headerMenusService.headerManagement.next(headerInfo);
  //     this.router.navigateByUrl('home');
  //   }
  // }

  // PARA EL EJERCICIO 3
  // login(): void {

  //   this.loginUser.email = this.email.value;
  //   this.loginUser.password = this.password.value;
    
  //   this.authService.login(this.loginUser).subscribe({
  //       next: (authToken) => {

  //         this.loginUser.user_id = authToken.user_id;
  //         this.loginUser.access_token = authToken.access_token; 
          
  //          // save token to localstorage for next requests
  //         this.localStorageService.set('user_id', this.loginUser.user_id);
  //         this.localStorageService.set('access_token', this.loginUser.access_token);

  //     const headerInfo: HeaderMenus = {
  //       showAuthSection: true,
  //       showNoAuthSection: false,
  //     };
  //     // update options menu
  //     this.headerMenusService.headerManagement.next(headerInfo);
  //     this.sharedService.managementToast('loginFeedback', true);
  //     this.router.navigateByUrl('home');
  //   }, 
  //   error: (error) => {
  //     const errorResponse = error.error;
  //     const headerInfo: HeaderMenus = {
  //       showAuthSection: false,
  //       showNoAuthSection: true,
  //     };
  //     this.headerMenusService.headerManagement.next(headerInfo);
  //     this.sharedService.errorLog(error.error);
  //     this.sharedService.managementToast('loginFeedback', false, errorResponse)
  //   }
  // })};

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
