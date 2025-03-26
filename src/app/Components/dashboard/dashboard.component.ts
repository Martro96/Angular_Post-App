import { Component, OnInit } from '@angular/core';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  posts!: PostDTO[];

  numLikes: number = 0;
  numDislikes: number = 0;

  constructor(
    private postService: PostService,
    private sharedService: SharedService
  ) {}

  
  //Juntamos todo en un único método ngOnInit que llama a getPosts del backend

  ngOnInit(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;

        this.numLikes = 0;
        this.numDislikes = 0;
      
        this.posts.forEach((post) => {
        this.numLikes += post.num_likes;
        this.numDislikes += post.num_dislikes;
      });
    },
      error: (error: any) => {
        this.sharedService.errorLog(error.error);
      }  
    });
  }


}