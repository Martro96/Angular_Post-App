import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { selectUserId } from 'src/app/Auth/reducers/auth.selectors';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  posts!: PostDTO[];
  showButtons: boolean;
  private userId!: string;

  constructor(
    // private headerMenusService: HeaderMenusService
    
    private postService: PostService,
    private sharedService: SharedService,
    private router: Router,
    private store: Store<AppState>, //Añado el estado de la app
    
  ) {
    this.showButtons = false;
  }

  ngOnInit(): void {

    this.store.pipe(select(selectUserId)).subscribe((userId) => {
        this.showButtons = !!userId;
        if (userId) {
          this.userId = userId;
          this.loadAllPosts();
        }
    })
  }


  private loadAllPosts(): void {
      this.postService.getAllPosts().subscribe({ 
        next: (posts) => { //esperamos los posts de la API
          this.posts = posts; //Los recogemos
          this.showButtons = true
        },
        error: (error: any) => {
          this.showButtons = false;
          this.sharedService.errorLog(error.error);
        }
      });
    }
  


  like(postId: string): void { 

    this.postService.likePost(postId).subscribe({
      next: () => { //Aqui no hace falta recoger ningún post de la API
        this.loadAllPosts();
      },
      error: (error: any) => {
        this.sharedService.errorLog(error.error);
      }
    });
  }



  dislike(postId: string): void {

    this.postService.dislikePost(postId).subscribe({
      next: () => { //Aqui no hace falta recoger ningún post de la API
        this.loadAllPosts();
      },
      error: (error: any) => {
        this.sharedService.errorLog(error.error);
      }
    });
  }
}