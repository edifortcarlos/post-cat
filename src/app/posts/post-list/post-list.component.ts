import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { Post } from '../post.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  private userLoged = false;
  private userAuthListenerSubs: Subscription;
  private postSubs: Subscription;
  private userId: string;
  posts = [];
  isLoading;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 3, 4, 5, 6, 8, 10];

  constructor(
    public postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postService
      .getPostsUpdated()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        this.userId = this.authService.getUserId();
      });

    this.userLoged = this.authService.isUserLoged();

    this.userAuthListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isUserLoged => {
        this.userLoged = isUserLoged;
      });
  }

  onPageChange(pageEvent: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageEvent.pageIndex + 1;
    this.postsPerPage = pageEvent.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.delete(postId).subscribe(
      () => {
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    if (this.postSubs) {
      this.postSubs.unsubscribe();
    }
    this.userAuthListenerSubs.unsubscribe();
  }
}
