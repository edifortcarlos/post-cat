import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatTableModule,
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatCardModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule
} from '@angular/material';

@NgModule({
  exports: [
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule
  ]
})
export class AngularMaterialModule {}
