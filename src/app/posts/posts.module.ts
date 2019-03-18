import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRountingModule } from '../app-rounting.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from './angular-material.module';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { Router } from '@angular/router';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    CommonModule,
    AppRountingModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  exports: []
})
export class PostsModule {}
