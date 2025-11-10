import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { Post } from '../interfaces/post.model';
import { Todo } from '../interfaces/todo.model';

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
  searchUsers(searchTerm: string) {
    return this.getUsers().pipe(
      map((users) => {
        let filteredUsers = users;

        if (searchTerm.trim()) {
          const searchLower = searchTerm.toLowerCase();
          filteredUsers = users.filter((user) => {
            const firstName = user.name.split(' ')[0].toLowerCase();
            const lastName = user.name.split(' ')[1]?.toLowerCase() || '';
            const email = user.email.toLowerCase();

            return (
              firstName.includes(searchLower) ||
              lastName.includes(searchLower) ||
              email.includes(searchLower)
            );
          });
        }

        return filteredUsers.map((user) => ({
          ...user,
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')[1] || '',
        }));
      })
    );
  }
  getPosts(start = 0, limit = 20) {
    return this.fetchData<Post[]>(
      `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`,
      'Failed to fetch posts'
    );
  }

  getPostsByUserId(userId: number) {
    return this.fetchData<Post[]>(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
      'Failed to fetch user posts'
    );
  }
  getTodosByUserId(userId: number) {
    return this.fetchData<Todo[]>(
      `https://jsonplaceholder.typicode.com/todos?userId=${userId}`,
      'Failed to fetch user todos'
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
