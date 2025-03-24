import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { error } from 'console';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {
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

  // async ngOnInit(): Promise<void> {
  //   let errorResponse: any;

  //   // update
  //   if (this.categoryId) {
  //     this.isUpdateMode = true;
  //     try {
  //       this.category = await this.categoryService.getCategoryById(
  //         this.categoryId
  //       );

  //       this.title.setValue(this.category.title);

  //       this.description.setValue(this.category.description);

  //       this.css_color.setValue(this.category.css_color);

  //       this.categoryForm = this.formBuilder.group({
  //         title: this.title,
  //         description: this.description,
  //         css_color: this.css_color,
  //       });
  //     } catch (error: any) {
  //       errorResponse = error.error;
  //       this.sharedService.errorLog(errorResponse);
  //     }
  //   }
  // }

  ngOnInit(): void {

    if (!this.categoryId) {
      return;
    }
    this.isUpdateMode = true;

    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.title.setValue(category.title);
        this.description.setValue(category.description);
        this.css_color.setValue(category.css_color);

      },

      error: (error: any) => {
        this.sharedService.errorLog(error.error);
      }

    });

  }
  // private async editCategory(): Promise<boolean> {
  //   let errorResponse: any;
  //   let responseOK: boolean = false;
  //   if (this.categoryId) {
  //     const userId = this.localStorageService.get('user_id');
  //     if (userId) {
  //       this.category.userId = userId;
  //       try {
  //         await this.categoryService.updateCategory(
  //           this.categoryId,
  //           this.category
  //         );
  //         responseOK = true;
  //       } catch (error: any) {
  //         errorResponse = error.error;
  //         this.sharedService.errorLog(errorResponse);
  //       }

  //       await this.sharedService.managementToast(
  //         'categoryFeedback',
  //         responseOK,
  //         errorResponse
  //       );

  //       if (responseOK) {
  //         this.router.navigateByUrl('categories');
  //       }
  //     }
  //   }
  //   return responseOK;
  // }


  editCategory(): void { //Lo cambiamos a void porque subscribe ya es asíncrono
    const userId = this.localStorageService.get('user_id');

    if (!this.categoryId || !userId) {
      return;
    }

    this.category.userId = userId //Nos aseguramos de que el usuario esté registrado

    this.categoryService.updateCategory(this.categoryId, this.category).subscribe({

      // Si quisieramos usar la repsuesta de la API, tendríamos que pasarlo por next
      // next: (updatedCategory) => { // Ahora usamos la respuesta de la API
      //   this.category = updatedCategory; // Actualizamos la categoría en la UI

      next: () => {
        this.sharedService.managementToast('categoryFeedback', true);
        this.router.navigateByUrl('categories');

      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
        this.sharedService.managementToast('categoryFeedback', false, error.error);
      }
    });
  }
  // private async createCategory(): Promise<boolean> {
  //   let errorResponse: any;
  //   let responseOK: boolean = false;
  //   const userId = this.localStorageService.get('user_id');
  //   if (userId) {
  //     this.category.userId = userId;
  //     try {
  //       await this.categoryService.createCategory(this.category);
  //       responseOK = true;
  //     } catch (error: any) {
  //       errorResponse = error.error;
  //       this.sharedService.errorLog(errorResponse);
  //     }

  //     await this.sharedService.managementToast(
  //       'categoryFeedback',
  //       responseOK,
  //       errorResponse
  //     );

  //     if (responseOK) {
  //       this.router.navigateByUrl('categories');
  //     }
  //   }

  //   return responseOK;
  // }

  createCategory(): void {
    const userId = this.localStorageService.get('user_id');

    if (!userId) {
      return;
    }
    this.category.userId = userId;

    this.categoryService.createCategory(this.category).subscribe({
      next: (category) => {
        this.router.navigateByUrl('categories');
        this.sharedService.managementToast('categoryFeedback', true);
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
        this.sharedService.managementToast('categoryFeedback', false, error.error);
      }
    });
  }

  //   async saveCategory() {
  //     this.isValidForm = false;

  //     if (this.categoryForm.invalid) {
  //       return;
  //     }

  //     this.isValidForm = true;
  //     this.category = this.categoryForm.value;

  //     if (this.isUpdateMode) {
  //       this.validRequest = await this.editCategory();
  //     } else {
  //       this.validRequest = await this.createCategory();
  //     }
  //   }
  // }

  saveCategory(): void {
    this.isValidForm = false;
  
    if (this.categoryForm.invalid) {
      return;
    }
  
    this.isValidForm = true;
    this.category = this.categoryForm.value;
    this.category.userId = this.localStorageService.get('user_id')!; //Tenemos que indicar a que usuario le pertenece la categoria

  
    if (this.isUpdateMode && this.categoryId) { //El updateMode nos permite saber si estamos editando la categoría o si vamos a crear una nueva
      this.category = this.categoryForm.value;
      this.category.categoryId = this.categoryId;
      this.category.userId = this.localStorageService.get('user_id')!;
      
      console.log('EDITANDO categoría con ID:', this.categoryId);
      console.log('Objeto enviado:', this.category);

      this.categoryService.updateCategory(this.categoryId, this.category).subscribe({
        next: () => {
          this.validRequest = true; // Si la actualización fue exitosa
          this.sharedService.managementToast('categoryFeedback', true);
          this.router.navigateByUrl('categories'); // Redirigir tras actualizar
        },
        error: (error) => {
          this.validRequest = false; // Si falló la petición
          this.sharedService.errorLog(error.error);
          this.sharedService.managementToast('categoryFeedback', false, error.error);
        }
      });
    } else { //Aqui como el updateMode estaría false, estamos en el contexto de creación
      this.categoryService.createCategory(this.category).subscribe({
        next: () => {
          this.validRequest = true;
          this.sharedService.managementToast('categoryFeedback', true);
          this.router.navigateByUrl('categories'); // Redirigir tras crear
        },
        error: (error) => {
          this.validRequest = false;
          this.sharedService.errorLog(error.error);
          this.sharedService.managementToast('categoryFeedback', false, error.error);
        }
      });
    }
  }
  
  }