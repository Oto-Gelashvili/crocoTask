import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.services';
import { Post } from '../interfaces/post.model';
import { LoaderComponent } from '../shared/loader/loader.component';
@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css'],
  standalone: true,
  imports: [LoaderComponent],
})
export class UserPostsComponent implements OnInit {
  posts = signal<Post[]>([]);
  isFetching = signal(true);
  error = signal('');
  username = signal('');
  openedCard = signal<Post | null>(null);

  openCard(post: Post) {
    this.openedCard.set(post);
  }

  closeCard() {
    this.openedCard.set(null);
  }

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadUserPosts(+params['userId']);
    });
    this.route.queryParams.subscribe((params) => {
      this.username.set(params['username'] || '');
    });
  }

  loadUserPosts(userId: number) {
    this.isFetching.set(true);
    this.error.set('');

    this.dataService.getPostsByUserId(userId).subscribe({
      next: (data) => {
        this.posts.set(data);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isFetching.set(false);
      },
      complete: () => this.isFetching.set(false),
    });
  }
}
