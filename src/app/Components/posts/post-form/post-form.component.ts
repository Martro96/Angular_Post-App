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
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { AppState } from 'src/app/app.reducer';
import { select, Store } from '@ngrx/store';
import { selectUserId } from 'src/app/Auth/reducers/auth.selectors';

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
  private userId!: string;


  categoriesList!: CategoryDTO[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private categoryService: CategoryService,
    private store: Store<AppState>
    
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



    this.postForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      publication_date: this.publication_date,
      categories: this.categories,
      num_likes: this.num_likes,
      num_dislikes: this.num_dislikes,
    });
  }


  ngOnInit(): void {
    this.store.pipe(select(selectUserId)).subscribe((userId) => {
      if (!userId) return;
  
      this.userId = userId;
  
      // Cargamos categorías del usuario
      this.categoryService.getCategoriesByUserId(userId).subscribe({
        next: (categories) => {
          this.categoriesList = categories;
        },
        error: (error: any) => {
          this.sharedService.errorLog(error.error);
        },
      });
  
      // Si estamos editando, cargamos los datos del post
      if (this.postId) {
        this.isUpdateMode = true;
        this.loadPostById(this.postId);
      }
    });
  }
  
  private loadPostById(postId: string): void {
    this.postService.getPostById(postId).subscribe({
      next: (post) => {
        this.post = post;
  
        this.title.setValue(post.title);
        this.description.setValue(post.description);
        this.publication_date.setValue(
          formatDate(post.publication_date, 'yyyy-MM-dd', 'en')
        );
  
        const categoriesIds = post.categories.map(
          (cat: CategoryDTO) => cat.categoryId
        );
        this.categories.setValue(categoriesIds);
  
        this.num_likes.setValue(post.num_likes);
        this.num_dislikes.setValue(post.num_dislikes);
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }
  


  private editPost(): void {


      if (!this.userId || !this.postId) {
        return;
      }
      

      if (this.post) {
        this.post.userId = this.userId;
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


  private createPost(): void {

    if (!this.userId) {
      return;
    }
    this.post.userId = this.userId;
      
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

  savePost(): void {
    this.isValidForm = false;
  
    if (this.postForm.invalid) {
      return;
    }
  
    this.isValidForm = true;
    this.post = this.postForm.value;
    this.post.userId = this.userId;
  
    if (this.isUpdateMode && this.postId) {
      this.postService.updatePost(this.postId, this.post).subscribe({
        next: () => {
          this.validRequest = true;
          this.sharedService.managementToast('postFeedback', true);
          this.router.navigateByUrl('posts');
        },
        error: (error) => {
          this.validRequest = false;
          this.sharedService.errorLog(error.error);
          this.sharedService.managementToast(
            'postFeedback',
            false,
            error.error
          );
        },
      });
    } else {
      this.postService.createPost(this.post).subscribe({
        next: () => {
          this.validRequest = true;
          this.sharedService.managementToast('postFeedback', true);
          this.router.navigateByUrl('posts');
        },
        error: (error) => {
          this.validRequest = false;
          this.sharedService.errorLog(error.error);
          this.sharedService.managementToast(
            'postFeedback',
            false,
            error.error
          );
        },
      });
    }
  }
  
}
