import { Component, signal } from '@angular/core';
import { Post } from '../interfaces/post.model';
import { DataService } from '../services/data.services';
import { LoaderComponent } from '../shared/loader/loader.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';
@Component({
  selector: 'app-posts',
  imports: [LoaderComponent, PaginationComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent {
  posts = signal<Post[]>([]);
  isFetching = signal(true);
  error = signal('');
  currentPage = signal(1);
  postsPerPage = 20;
  totalPosts = 100;
  openedPost = signal<Post | null>(null);

  openPost(post: Post) {
    this.openedPost.update((current) => (current === post ? null : post));
  }

  constructor(private dataService: DataService) {
    this.loadPosts(this.currentPage());
  }

  loadPosts(page: number) {
    this.isFetching.set(true);
    this.error.set('');
    const start = (page - 1) * this.postsPerPage;

    this.dataService.getPosts(start, this.postsPerPage).subscribe({
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
  goToPage(page: number) {
    if (page !== this.currentPage()) {
      this.currentPage.set(page);
      this.loadPosts(page);
    }
  }

  totalPages() {
    return Math.ceil(this.totalPosts / this.postsPerPage);
  }
}
