import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.services';
import { LoaderComponent } from '../shared/loader/loader.component';
import { Todo } from '../interfaces/todo.model';

@Component({
  selector: 'app-user-todos',
  imports: [LoaderComponent],
  templateUrl: './user-todos.component.html',
  styleUrl: './user-todos.component.css',
})
export class UserTodosComponent implements OnInit {
  todos = signal<Todo[]>([]);
  isFetching = signal(true);
  error = signal('');
  username = signal('');

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadUserTodos(+params['userId']);
    });
    this.route.queryParams.subscribe((params) => {
      this.username.set(params['username'] || '');
    });
  }
  loadUserTodos(userId: number) {
    this.isFetching.set(true);
    this.error.set('');

    this.dataService.getTodosByUserId(userId).subscribe({
      next: (data) => {
        this.todos.set(data);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isFetching.set(false);
      },
      complete: () => this.isFetching.set(false),
    });
  }
}
