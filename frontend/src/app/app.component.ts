import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthenticationService } from './authorization/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title: 'mean-first';

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    this.authService.verifyLoginStatus();
  }
}
