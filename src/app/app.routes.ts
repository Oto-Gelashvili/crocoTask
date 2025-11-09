import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { HomePageComponent } from './homePage/homePage.component';
import { PostsComponent } from './posts/posts.component';
import { PromosComponent } from './promos/promos.component';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { UserTodosComponent } from './user-todos/user-todos.component';
export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    pathMatch: 'full',
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  { path: 'posts/:userId', component: UserPostsComponent },
  { path: 'todos/:userId', component: UserTodosComponent },

  {
    path: 'posts',
    component: PostsComponent,
  },
  {
    path: 'promos',
    component: PromosComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
