// import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { SharedService } from 'src/app/Services/shared.service';
import { AppState } from 'src/app/app.reducer';
import { select, Store } from '@ngrx/store';
import { selectUserId } from 'src/app/Auth/reducers/auth.selectors';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent {
  categories!: CategoryDTO[];
  private userId!: string;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    // private localStorageService: LocalStorageService,
    private sharedService: SharedService, 
    private store: Store<AppState>
  ) {
  }

  // private async loadCategories(): Promise<void> {
  //   let errorResponse: any;
  //   const userId = this.localStorageService.get('user_id');
  //   if (userId) {
  //     try {
  //       this.categories = await this.categoryService.getCategoriesByUserId(
  //         userId
  //       );
  //     } catch (error: any) {
  //       errorResponse = error.error;
  //       this.sharedService.errorLog(errorResponse);
  //     }
  //   }
  // }

  ngOnInit(): void {
    this.store.pipe(select(selectUserId)).subscribe((userId) => {
      if (userId) {
        this.userId = userId;
        this.loadCategories(userId);
      }
    })
  }

  loadCategories(userId: string): void {
    //const userId = this.localStorageService.get('user_id');

    if (!userId) {
      return
    }

    this.categoryService.getCategoriesByUserId(userId).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error: any) => {
        this.sharedService.errorLog(error.error);
      }
    })
  }


  createCategory(): void {
    this.router.navigateByUrl('/user/category/');
  }

  updateCategory(categoryId: string): void {
    this.router.navigateByUrl('/user/category/' + categoryId);
  }

  //   async deleteCategory(categoryId: string): Promise < void> {
  //   let errorResponse: any;

  //   // show confirmation popup
  //   let result = confirm(
  //     'Confirm delete category with id: ' + categoryId + ' .'
  //   );
  //   if(result) {
  //     try {
  //       const rowsAffected = await this.categoryService.deleteCategory(
  //         categoryId
  //       );
  //       if (rowsAffected.affected > 0) {
  //         this.loadCategories();
  //       }
  //     } catch (error: any) {
  //       errorResponse = error.error;
  //       this.sharedService.errorLog(errorResponse);
  //     }
  //   }
  // }
  // }
  deleteCategory(categoryId: string): void {

    if (!categoryId) {
      return;
    }
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (deleteResponse) => {

        //Mostrar mensaje de éxito
        this.sharedService.managementToast('Confirm delete category with id: ' + categoryId + ' .', true)

        if (!deleteResponse || !deleteResponse.affected || deleteResponse.affected > 0) {
          this.loadCategories(this.userId);
        }
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
        this.sharedService.managementToast('Error al eliminar la categoría.', false, error.error);
      }
    });

  }
}
