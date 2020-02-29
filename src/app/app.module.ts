import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgxNavbarModule } from 'ngx-bootstrap-navbar';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MainComponent } from './pages/main/main.component';
import { NewCarsComponent } from './pages/new-cars/new-cars.component';
import { FundingComponent } from './pages/funding/funding.component';
import { TradeInComponent } from './pages/trade-in/trade-in.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { GuaranteeComponent } from './pages/guarantee/guarantee.component';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './pages/login/login.component';
import { AdminEditComponent } from './pages/admin-edit/admin-edit.component';
import { MarksService } from './services/marks.service';
import 'firebase/database';
import 'firebase/storage';
import { UploadService } from './services/upload.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    NewCarsComponent,
    FundingComponent,
    TradeInComponent,
    ContactsComponent,
    GuaranteeComponent,
    LoginComponent,
    AdminEditComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,

    NgxNavbarModule,

    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    ButtonsModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [
    AuthService,
    MarksService,
    UploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
