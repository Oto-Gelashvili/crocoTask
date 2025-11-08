import { Component, signal } from '@angular/core';
import { Post } from '../interfaces/post.model';
import { DataService } from '../services/data.services';
import { LoaderComponent } from '../shared/loader/loader.component';
import { NgForOf } from '@angular/common';
@Component({
  selector: 'app-posts',
  imports: [LoaderComponent, NgForOf],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent {
  posts = signal<Post[]>([]);
  isFetching = signal(true);
  error = signal('');

  constructor(private dataService: DataService) {
    this.loadPosts();
  }

  loadPosts() {
    this.isFetching.set(true);
    this.error.set('');

    this.dataService.getPosts().subscribe({
      next: (data) => {
        this.posts.set(data);
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
