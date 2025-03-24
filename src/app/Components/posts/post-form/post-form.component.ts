import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  post: PostDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  num_likes!: UntypedFormControl;
  num_dislikes!: UntypedFormControl;
  publication_date: UntypedFormControl;
  categories!: UntypedFormControl;

  postForm: UntypedFormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private postId: string | null;

  categoriesList!: CategoryDTO[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private categoryService: CategoryService
  ) {
    this.isValidForm = null;
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.post = new PostDTO('', '', 0, 0, new Date());
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new UntypedFormControl(this.post.title, [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.description = new UntypedFormControl(this.post.description, [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.publication_date = new UntypedFormControl(
      formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.num_likes = new UntypedFormControl(this.post.num_likes);
    this.num_dislikes = new UntypedFormControl(this.post.num_dislikes);

    this.categories = new UntypedFormControl([]);

    // get categories by user and load multi select
    this.loadCategories();

    this.postForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      publication_date: this.publication_date,
      categories: this.categories,
      num_likes: this.num_likes,
      num_dislikes: this.num_dislikes,
    });
  }

  // private async loadCategories(): Promise<void> {
  //   let errorResponse: any;
  //   const userId = this.localStorageService.get('user_id');
  //   if (userId) {
  //     try {
  //       this.categoriesList = await this.categoryService.getCategoriesByUserId(
  //         userId
  //       );
  //     } catch (error: any) {
  //       errorResponse = error.error;
  //       this.sharedService.errorLog(errorResponse);
  //     }
  //   }
  // }

  private loadCategories(): void {
    const userId = this.localStorageService.get('user_id');
    
    if (!userId) {
      return;
    }
    
    this.categoryService.getCategoriesByUserId(userId).subscribe({
      next: (categories) => {
        this.categoriesList = categories;
      },

      error: (error: any) => {
        this.sharedService.errorLog(error.error);
      }
    });
  }

  // async ngOnInit(): Promise<void> {
  //   let errorResponse: any;
  //   // update
  //   if (this.postId) {
  //     this.isUpdateMode = true;
  //     try {
  //       this.post = await this.postService.getPostById(this.postId);

  //       this.title.setValue(this.post.title);

  //       this.description.setValue(this.post.description);

  //       this.publication_date.setValue(
  //         formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en')
  //       );

  //       let categoriesIds: string[] = [];
  //       this.post.categories.forEach((cat: CategoryDTO) => {
  //         categoriesIds.push(cat.categoryId);
  //       });

  //       this.categories.setValue(categoriesIds);

  //       this.num_likes.setValue(this.post.num_likes);
  //       this.num_dislikes.setValue(this.post.num_dislikes);

  //       this.postForm = this.formBuilder.group({
  //         title: this.title,
  //         description: this.description,
  //         publication_date: this.publication_date,
  //         categories: this.categories,
  //         num_likes: this.num_likes,
  //         num_dislikes: this.num_dislikes,
  //       });
  //     } catch (error: any) {
  //       errorResponse = error.error;
  //       this.sharedService.errorLog(errorResponse);
  //     }
  //   }
  // }

  ngOnInit(): void {
    this.isUpdateMode = false;

    // update
    if (!this.postId) {
      return;
    }

    this.postService.getPostById(this.postId).subscribe({
      next: (post) => {
        this.isUpdateMode = true;
        this.post = post;

        this.title.setValue(this.post.title);
        this.description.setValue(this.post.description);
        this.publication_date.setValue(
          formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en')
        );

        //Aquí cambio el .push a map como hicimos en la teoría
        const categoriesIds = post.categories.map((category: CategoryDTO) => category.categoryId);

        this.categories.setValue(categoriesIds);

        this.num_likes.setValue(this.post.num_likes);
        this.num_dislikes.setValue(this.post.num_dislikes);


      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      }
    });
  }


  // private async editPost(): Promise<boolean> {
  //   let errorResponse: any;
  //   let responseOK: boolean = false;
  //   if (this.postId) {
  //     const userId = this.localStorageService.get('user_id');
  //     if (userId) {
  //       this.post.userId = userId;
  //       try {
  //         await this.postService.updatePost(this.postId, this.post);
  //         responseOK = true;
  //       } catch (error: any) {
  //         errorResponse = error.error;
  //         this.sharedService.errorLog(errorResponse);
  //       }

  //       await this.sharedService.managementToast(
  //         'postFeedback',
  //         responseOK,
  //         errorResponse
  //       );

  //       if (responseOK) {
  //         this.router.navigateByUrl('posts');
  //       }
  //     }
  //   }
  //   return responseOK;
  // }

  
  private editPost(): void {

      const userId = this.localStorageService.get('user_id');

      if (!userId || !this.postId) {
        return;
      }
      
      // this.post.userId = userId;
      if (this.post) {
        this.post.userId = userId;
      }

      this.postService.updatePost(this.postId, this.post).subscribe({
        next: () => {
          this.sharedService.managementToast('postFeedback', true);
          this.router.navigateByUrl('posts');
          },
          error: (error) => {
            this.sharedService.errorLog(error.error);
            this.sharedService.managementToast('postFeedback', false, error.error);
          }
      });
  }
  // private async createPost(): Promise<boolean> {
  //   let errorResponse: any;
  //   let responseOK: boolean = false;
  //   const userId = this.localStorageService.get('user_id');
  //   if (userId) {
  //     this.post.userId = userId;
  //     try {
  //       await this.postService.createPost(this.post);
  //       responseOK = true;
  //     } catch (error: any) {
  //       errorResponse = error.error;
  //       this.sharedService.errorLog(errorResponse);
  //     }

  //     await this.sharedService.managementToast(
  //       'postFeedback',
  //       responseOK,
  //       errorResponse
  //     );

  //     if (responseOK) {
  //       this.router.navigateByUrl('posts');
  //     }
  //   }

  //   return responseOK;
  // }

  private createPost(): void {

    const userId = this.localStorageService.get('user_id');
    if (!userId) {
      return;
    }
    this.post.userId = userId;
      
    this.postService.createPost(this.post).subscribe({
      next: (post) => {
        this.sharedService.managementToast('postFeedback', true);
        this.router.navigateByUrl('posts');

      }, 
      error: (error: any) => {
        this.sharedService.errorLog(error.error);

      }
    });
  }
  // async savePost() {
  //   this.isValidForm = false;

  //   if (this.postForm.invalid) {
  //     return;
  //   }

  //   this.isValidForm = true;
  //   this.post = this.postForm.value;

  //   if (this.isUpdateMode) {
  //     this.validRequest = await this.editPost();
  //   } else {
  //     this.validRequest = await this.createPost();
  //   }
  // }

  savePost(): void {
    this.isValidForm = false;

    if (this.postForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.post = this.postForm.value;
    this.post.userId = this.localStorageService.get('user_id')!;

    if (this.isUpdateMode && this.postId) {
      this.postService.updatePost(this.postId, this.post).subscribe({
        next: () => {
          this.validRequest = true;
          this.sharedService.managementToast('postFeedback', true);
          this.router.navigateByUrl('posts');
        }, 
        error: (error) => {
          this.validRequest = false; // Si falló la petición
          this.sharedService.errorLog(error.error);
          this.sharedService.managementToast('postFeedback', false, error.error);
        }
      });
    } else {
      this.postService.createPost(this.post).subscribe({
        next: () => {
          this.validRequest = true;
          this.sharedService.managementToast('postFeedback', true);
          this.router.navigateByUrl('posts'); // Redirigir tras crear
        },
        error: (error) => {
          this.validRequest = false;
          this.sharedService.errorLog(error.error);
          this.sharedService.managementToast('postFeedback', false, error.error);
        }
      });
    }
  }
}
