import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { AppState } from 'src/app/app.reducer';
import { select, Store } from '@ngrx/store';
import { selectUserId } from 'src/app/Auth/reducers/auth.selectors';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent {
  posts!: PostDTO[];
  private userId!: string;

  constructor(
    private postService: PostService,
    private router: Router,
    private sharedService: SharedService,
    private store: Store<AppState>
  ) {}

  // private async loadPosts(): Promise<void> {
  //   let errorResponse: any;
  //   const userId = this.localStorageService.get('user_id');
  //   if (userId) {
  //     try {
  //       this.posts = await this.postService.getPostsByUserId(userId);
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
        this.loadPostsByUserId();
      }
    });
  }
  private loadPostsByUserId(): void {
    console.log('User ID: ' + this.userId);
    this.postService.getPostsByUserId(this.userId).subscribe({
      next: (posts) => {
        console.log('Posts recibidos: ' + posts);
        this.posts = posts;
      },
      error: (error: any) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }

  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/post/' + postId);
  }

  // async deletePost(postId: string): Promise<void> {
  //   let errorResponse: any;

  //   // show confirmation popup
  //   let result = confirm('Confirm delete post with id: ' + postId + ' .');
  //   if (result) {
  //     try {
  //       const rowsAffected = await this.postService.deletePost(postId);
  //       if (rowsAffected.affected > 0) {
  //         this.loadPosts();
  //       }
  //     } catch (error: any) {
  //       errorResponse = error.error;
  //       this.sharedService.errorLog(errorResponse);
  //     }
  //   }
  // }
  deletePost(postId: string): void {
    if (!postId) {
      return;
    }

    this.postService.deletePost(postId).subscribe({
      next: (deleteResponse) => {
        this.sharedService.managementToast(
          'Confirm delete post with id: ' + postId + ' .',
          true
        );

        if (deleteResponse?.affected > 0) {
          this.loadPostsByUserId();
        }
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
        this.sharedService.managementToast(
          'Error al eliminar el post.',
          false,
          error.error
        );
      },
    });
  }
}
