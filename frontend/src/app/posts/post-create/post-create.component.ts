import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostService } from "../post.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { mimeType } from './mime-type.validator'

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit {
  private mode = "create";
  private postId: string;

  isLoading = false;
  post: Post;
  form: FormGroup;
  imagePreview: string;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null,  { validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;

        this.postService.getPost(this.postId).subscribe((result) => {
          this.isLoading = false;
          this.post = {
            id: result.post._id,
            title: result.post.title,
            content: result.post.content,
            imagePath: result.post.imagePath,
            createdBy: result.post.createdBy
          };

          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });

          this.imagePreview = this.post.imagePath;
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  getErrorMessage() {
    return "Please enter a text";
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode == "create") {
      this.postService.addPost( this.form.value.title,
                                this.form.value.content,
                                this.form.value.image);
      this.form.reset();
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview =  reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
