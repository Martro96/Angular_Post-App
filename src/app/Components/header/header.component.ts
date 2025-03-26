import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { selectUserId } from 'src/app/Auth/reducers/auth.selectors';
import { logout } from 'src/app/Auth/actions/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showAuthSection: boolean;
  showNoAuthSection: boolean;
  private userId!: string;

  constructor(
    private router: Router,
    private store: Store<AppState> 

  ) {
    this.showAuthSection = false;
    this.showNoAuthSection = true;
  }


  ngOnInit(): void {

    this.store.pipe(select(selectUserId)).subscribe((userId) => {
      this.userId = userId;
      this.showAuthSection = !!userId;
      this.showNoAuthSection = !userId; 

      if (userId) {
        this.userId = userId;
      }
    })
  }
  

  dashboard(): void {
    this.router.navigateByUrl('dashboard');
  }

  home(): void {
    this.router.navigateByUrl('home');
  }

  login(): void {
    this.router.navigateByUrl('login');
  }

  register(): void {
    this.router.navigateByUrl('register');
  }

  adminPosts(): void {
    this.router.navigateByUrl('posts');
  }

  adminCategories(): void {
    this.router.navigateByUrl('categories');
  }

  profile(): void {
    this.router.navigateByUrl('profile');
  }

  logout(): void {
    this.store.dispatch(logout())
    this.router.navigateByUrl('home')
  }
}