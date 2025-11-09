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
  getPosts(start = 0, limit = 20) {
    return this.fetchData<Post[]>(
      `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`,
      'Failed to fetch posts'
    );
  }

  searchUsers(term: string) {
    const url = term
      ? `https://jsonplaceholder.typicode.com/users?name_like=${term}`
      : 'https://jsonplaceholder.typicode.com/users';
    return this.httpClient.get<User[]>(url).pipe(
      catchError((error) => {
        console.error('Failed to search users', error);
        return throwError(() => new Error('Failed to search users'));
      })
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
