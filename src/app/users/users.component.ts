import { Component, signal, OnDestroy, inject } from '@angular/core';
import { DataService } from '../services/data.services';
import { User } from '../interfaces/user.model';
import { LoaderComponent } from '../shared/loader/loader.component';
import { FormsModule } from '@angular/forms';
import {
  debounceTime,
  Subject,
  switchMap,
  catchError,
  of,
  finalize,
} from 'rxjs';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [LoaderComponent, FormsModule],
})
export class UsersComponent implements OnDestroy {
  users = signal<User[]>([]);
  isFetching = signal(true);
  error = signal('');
  searchTerm = signal('');

  private searchSubject = new Subject<string>();
  private dataService = inject(DataService);
  private router = inject(Router);

  constructor() {
    this.initializeSearch();
  }

  navigateToUserContent(userId: number, username: string, path: string) {
    this.router.navigate([path, userId], {
      queryParams: { username },
    });
  }

  onSearchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.searchSubject.next(term);
  }

  private initializeSearch() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((term) => {
          this.isFetching.set(true);
          this.error.set('');

          return this.dataService.searchUsers(term).pipe(
            catchError((err) => {
              console.error('Search error:', err);
              this.error.set(err.message);
              return of([]);
            }),
            finalize(() => this.isFetching.set(false))
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe((filteredUsers) => {
        this.users.set(filteredUsers);
      });

    //  initial load
    this.searchSubject.next('');
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
