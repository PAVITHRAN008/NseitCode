import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CdkTableExporterModule } from 'cdk-table-exporter';
@NgModule({

    exports: [
        MatTableModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatDatepickerModule,
        MatSelectModule,
        MatCardModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatDialogModule,
        MatPaginatorModule,
        MatSidenavModule,
        MatRadioModule,
        MatExpansionModule,
        MatSnackBarModule,
        MatGridListModule,
        MatAutocompleteModule,
        MatTableExporterModule,
        CdkTableExporterModule
    ],
    providers: [MatDatepickerModule, MatNativeDateModule,
        MatDialogModule ,{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
})
export class AppMaterialModule { }