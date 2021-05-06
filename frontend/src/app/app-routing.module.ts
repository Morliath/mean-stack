import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './authorization/login/login.component';
import { AuthorizationGuard } from './authorization/authorization.guard';

const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthorizationGuard]},
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthorizationGuard]},
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthorizationGuard]
})
export class AppRoutingModule {}
