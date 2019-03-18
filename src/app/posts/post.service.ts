import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Post } from './post.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  private postGoonesStatus = new Subject<boolean>();

  POST_URL = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    // Begin assigning parameters
    const queryParams = new HttpParams()
      .append('pageSize', postsPerPage.toString())
      .append('page', currentPage.toString());

    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        `${this.POST_URL}`,
        { params: queryParams }
      )
      .pipe(
        map(resData => {
          return {
            posts: resData.posts.map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: resData.maxPosts
          };
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          postCount: transformedPosts.maxPosts
        });
      });
  }

  getPostsUpdated() {
    return this.postUpdated.asObservable();
  }

  getPostGoodnesStatus() {
    return this.postGoonesStatus.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ success: boolean; post: Post }>(this.POST_URL, postData)
      .subscribe(response => {
        // const post = {
        //   id: response.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: response.post.imagePath
        // };
        // this.posts.push(post);
        // this.postUpdated.next([...this.posts]);
        console.log(response);
        this.router.navigate(['/']);
      });
  }

  getPost(id: string) {
    return this.http.get<Post>(`${this.POST_URL}/${id}`);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }

    this.http.put(`${this.POST_URL}/${id}`, postData).subscribe(
      response => {
        // const updatedPosts = [...this.posts];
        // const postIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: ''
        // };
        // updatedPosts[postIndex] = post;
        // this.posts = updatedPosts;
        // this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      },
      err => {
        this.postGoonesStatus.next(false);
      }
    );
  }

  delete(postId: string) {
    return this.http.delete(`${this.POST_URL}/${postId}`);
  }
}
