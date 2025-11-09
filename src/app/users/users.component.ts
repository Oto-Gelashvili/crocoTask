import { Component, signal } from '@angular/core';
import { DataService } from '../services/data.services';
import { User } from '../interfaces/user.model';
import { LoaderComponent } from '../shared/loader/loader.component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [LoaderComponent],
})
export class UsersComponent {
  users = signal<User[]>([]);
  isFetching = signal(true);
  error = signal('');

  constructor(private dataService: DataService) {
    this.loadUsers();
  }

  loadUsers() {
    this.isFetching.set(true);
    this.error.set('');

    this.dataService.getUsers().subscribe({
      next: (data) => {
        this.users.set(
          data.map((user) => {
            return {
              ...user,
              firstName: user.name.split(' ')[0],
              lastName: user.name.split(' ')[1],
            };
          })
        );
      },
      error: (err) => {
        console.log(err.message, err);
        this.error.set(err.message);
        this.isFetching.set(false);
      },
      complete: () => this.isFetching.set(false),
    });
  }
}
