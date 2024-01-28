import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogoImageComponent } from './shared/logo-image/logo-image.component';
import { LogoTitleComponent } from './shared/logo-title/logo-title.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PreAuthModule } from './pre-auth/pre-auth.module';
import { AuthGuard } from './core/auth.guard';
@NgModule({
  declarations: [
    AppComponent,
    LogoImageComponent,
    LogoTitleComponent,

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    PreAuthModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
