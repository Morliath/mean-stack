import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthenticationService } from '../../authorization/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  isLoading= false;
  totalPost = 0;
  postPerPage = 3;
  pageSizeOptions = [3, 6, 9];
  currentPage = 0;
  authenticated = false;
  BACKEND_URL = environment.imagesURL;

  private postSubs: Subscription;
  private totalPostsCount: Subscription;
  private tokenListenerSubs: Subscription;

  constructor(private postService: PostService, private authService: AuthenticationService, private router: Router) {}

  ngOnDestroy(): void {
    this.postSubs.unsubscribe();
    this.totalPostsCount.unsubscribe();
    this.tokenListenerSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.postService.getPostList(this.postPerPage, this.currentPage);
    this.postSubs = this.postService.getPostUpdateListenet()
      .subscribe((postList: Post[])=> {
        this.isLoading = false;
        this.posts = postList;
        //console.log("Updated list: ");
        //console.log(this.posts);
      });

    this.totalPostsCount = this.postService.gettotalPostsCountListener()
      .subscribe( ( count ) => {
        this.totalPost = count;
      });

      this.authenticated = this.authService.isAuthenticated();

      this.tokenListenerSubs = this.authService
      .getTokenStatusListener()
      .subscribe( status => {
        this.authenticated = status;
      });
  }

  getUserId(){
    return this.authService.getUserName();
  }

  onDelete(id: string){
    this.isLoading = true;
    this.postService.deletePost(id)
    .subscribe( () => {
      this.postService.removePost(id);
      this.totalPost--;
      this.router.navigate(["/"]);
    }, () => {
      this.isLoading = false;
    });
  }

  onPageChanged(pageData: PageEvent){
    this.isLoading = true;

    this.currentPage = pageData.pageIndex;
    this.postPerPage = pageData.pageSize;

    this.postService.getPostList(this.postPerPage, this.currentPage);
  }
}


