import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { UserDTO } from 'src/app/Models/user.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { selectUserId } from 'src/app/Auth/reducers/auth.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileUser: UserDTO;

  name: UntypedFormControl;
  surname_1: UntypedFormControl;
  surname_2: UntypedFormControl;
  alias: UntypedFormControl;
  birth_date: UntypedFormControl;
  email: UntypedFormControl;
  password: UntypedFormControl;

  profileForm: UntypedFormGroup;
  isValidForm: boolean | null;
  private userId!: string;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private store: Store<AppState>
    
  ) {
    this.profileUser = new UserDTO('', '', '', '', new Date(), '', '');

    this.isValidForm = null;

    this.name = new UntypedFormControl(this.profileUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.surname_1 = new UntypedFormControl(this.profileUser.surname_1, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.surname_2 = new UntypedFormControl(this.profileUser.surname_2, [
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.alias = new UntypedFormControl(this.profileUser.alias, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.birth_date = new UntypedFormControl(
      formatDate(this.profileUser.birth_date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.email = new UntypedFormControl(this.profileUser.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new UntypedFormControl(this.profileUser.password, [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.profileForm = this.formBuilder.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {
    this.store.pipe(select(selectUserId)).subscribe((userId) => {
      if (!userId) return;
      
      this.userId = userId;
      
      this.userService.getUSerById(userId).subscribe({
        next: (userData) => {
          this.name.setValue(userData.name);
          this.surname_1.setValue(userData.surname_1);
          this.surname_2.setValue(userData.surname_2);
          this.alias.setValue(userData.alias);
          this.birth_date.setValue(
            formatDate(userData.birth_date, 'yyyy-MM-dd', 'en')
          );
          this.email.setValue(userData.email);
        },
        error: (error: any) => {
          this.sharedService.errorLog(error.error);
        }
      });
    })    
  }


  updateUser(): void {

    if (!this.userId || this.profileForm.invalid) {
      return;
    }

    this.isValidForm = false; //reseteamos antes de intentar actualizar
    this.profileUser = this.profileForm.value;

    this.userService.updateUser(this.userId, this.profileUser).subscribe({
      next: () => {
        this.isValidForm = true; //sólo si el update fue ok
        this.profileForm.reset(); // Reset the form


        //Mostrar mensaje de éxito
        this.sharedService.managementToast('updateFeedback', true)
      },
      error: (error) => {
        this.isValidForm = false; // Asegurar que se queda en estado incorrecto si hay fallo
        this.sharedService.errorLog(error.error);
        this.sharedService.managementToast('updateFeedback', false, error.error);  
      }
    }
    )
  }
}
