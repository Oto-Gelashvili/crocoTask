import { Component, signal } from '@angular/core';
import { DataService } from '../services/data.services';
import { User } from '../interfaces/user.model';
import { LoaderComponent } from '../shared/loader/loader.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [LoaderComponent, FormsModule],
})
export class UsersComponent {
  users = signal<User[]>([]);
  isFetching = signal(true);
  error = signal('');
  searchTerm = signal('');
  //manage search term
  private searchSubject = new Subject<string>();
  //manage subscriptions
  private subscriptions = new Subscription();

  constructor(private dataService: DataService, private router: Router) {
    this.setupSearch();
    //initial render that willrender all users
    this.performSearch('');
  }

  // navigateToUserPosts(userId: number, username: string) {
  //   this.router.navigate(['/posts', userId], {
  //     queryParams: { username: username },
  //   });
  // }
  // navigateToUserTodos(userId: number, username: string) {
  //   this.router.navigate(['/todos', userId], {
  //     queryParams: { username: username },
  //   });
  // }
  navigateToUsersX(userId: number, username: string, path: string) {
    this.router.navigate([path, userId], {
      queryParams: { username: username },
    });
  }

  setupSearch() {
    const searchSub = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((term) => {
        this.performSearch(term);
      });
    this.subscriptions.add(searchSub);
  }

  onSearchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.searchSubject.next(term);
  }

  performSearch(term: string) {
    this.isFetching.set(true);
    this.error.set('');

    const dataSub = this.dataService.getUsers().subscribe({
      next: (data) => {
        let filteredUsers = data;

        if (term.trim()) {
          const searchLower = term.toLowerCase();
          filteredUsers = data.filter((user) => {
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

        this.users.set(
          filteredUsers.map((user) => ({
            ...user,
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ')[1] || '',
          }))
        );
      },
      error: (err) => {
        console.log(err.message, err);
        this.error.set(err.message);
        this.isFetching.set(false);
      },
      complete: () => this.isFetching.set(false),
    });
    this.subscriptions.add(dataSub);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.searchSubject.complete();
  }
}
