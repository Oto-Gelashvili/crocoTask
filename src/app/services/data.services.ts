import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user.model';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Post } from '../interfaces/post.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private httpClient = inject(HttpClient);

  getUsers() {
    return this.fetchData<User[]>(
      'https://jsonplaceholder.typicode.com/users',
      'Failed to fetch users'
    );
  }
  getPosts() {
    return this.fetchData<Post[]>(
      `https://jsonplaceholder.typicode.com/posts`,
      'Failed to fetch posts'
    );
  }
  private fetchData<T>(url: string, errorMsg: string) {
    return this.httpClient.get<T>(url).pipe(
      catchError((error) => {
        console.error(errorMsg, error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
