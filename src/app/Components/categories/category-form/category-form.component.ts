import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { SharedService } from 'src/app/Services/shared.service';
import { AppState } from 'src/app/app.reducer';
import { select, Store } from '@ngrx/store';
import { selectUserId } from 'src/app/Auth/reducers/auth.selectors';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  category: CategoryDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  css_color: UntypedFormControl;

  categoryForm: UntypedFormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private categoryId: string | null;
  private userId!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private store: Store<AppState>
  ) 
  {
    this.isValidForm = null;
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.category = new CategoryDTO('', '', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new UntypedFormControl(this.category.title, [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.description = new UntypedFormControl(this.category.description, [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.css_color = new UntypedFormControl(this.category.css_color, [
      Validators.required,
      Validators.maxLength(7),
    ]);

    this.categoryForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      css_color: this.css_color,
    });
  }

  ngOnInit(): void {
    this.store.pipe(select(selectUserId)).subscribe((userId) => {
      this.userId = userId;

      if (this.categoryId) {
        this.isUpdateMode = true;

        this.categoryService.getCategoryById(this.categoryId).subscribe({
          next: (category) => {
            this.title.setValue(category.title);
            this.description.setValue(category.description);
            this.css_color.setValue(category.css_color);
          },

          error: (error: any) => {
            this.sharedService.errorLog(error.error);
          },
        });
      }
    });
  }

  editCategory(categoryId: string, userId: string): void {

    if (!this.categoryId || !userId) {
      return;
    }

    this.category.userId = userId; //Nos aseguramos de que el usuario esté registrado
    this.category.categoryId = categoryId;

    this.categoryService
      .updateCategory(this.categoryId, this.category)
      .subscribe({
        next: () => {
          this.sharedService.managementToast('categoryFeedback', true);
          this.router.navigateByUrl('categories');
        },
        error: (error) => {
          this.sharedService.errorLog(error.error);
          this.sharedService.managementToast(
            'categoryFeedback',
            false,
            error.error
          );
        },
      });
  }
 

  createCategory(): void {
    if (!this.userId) {
      return;
    }
    this.category.userId = this.userId;

    this.categoryService.createCategory(this.category).subscribe({
      next: (category) => {
        this.router.navigateByUrl('categories');
        this.sharedService.managementToast('categoryFeedback', true);
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
        this.sharedService.managementToast(
          'categoryFeedback',
          false,
          error.error
        );
      },
    });
  }

  saveCategory(): void {
    this.isValidForm = false;

    if (this.categoryForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.category = this.categoryForm.value;
    this.category.userId = this.userId;


    if (this.isUpdateMode && this.categoryId) {
      //El updateMode nos permite saber si estamos editando la categoría o si vamos a crear una nueva
      this.category = this.categoryForm.value;

      console.log('EDITANDO categoría con ID:', this.categoryId);
      console.log('Objeto enviado:', this.category);

      this.categoryService
        .updateCategory(this.categoryId, this.category)
        .subscribe({
          next: () => {
            this.validRequest = true; // Si la actualización fue exitosa
            this.sharedService.managementToast('categoryFeedback', true);
            this.router.navigateByUrl('categories'); // Redirigir tras actualizar
          },
          error: (error) => {
            this.validRequest = false; // Si falló la petición
            this.sharedService.errorLog(error.error);
            this.sharedService.managementToast(
              'categoryFeedback',
              false,
              error.error
            );
          },
        });
    } else {
      //Aqui como el updateMode estaría false, estamos en el contexto de creación
      this.categoryService.createCategory(this.category).subscribe({
        next: () => {
          this.validRequest = true;
          this.sharedService.managementToast('categoryFeedback', true);
          this.router.navigateByUrl('categories'); // Redirigir tras crear
        },
        error: (error) => {
          this.validRequest = false;
          this.sharedService.errorLog(error.error);
          this.sharedService.managementToast(
            'categoryFeedback',
            false,
            error.error
          );
        },
      });
    }
  }
}
