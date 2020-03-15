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
import { PopoverModule } from 'ngx-bootstrap/popover';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { ChipsModule } from 'primeng/chips';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { OrderListModule } from 'primeng/orderlist';
import { CarouselModule as PrimeCarouselModule } from 'primeng/carousel';
import { EditorModule } from 'primeng/editor';

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
import { ModelsGridComponent } from './shared/models-grid/models-grid.component';
import { ModelPresentationComponent } from './pages/model-presentation/model-presentation.component';
import { DesignModuleComponent } from './pages/model-presentation/design-module/design-module.component';
import { GalleryModuleComponent } from './pages/model-presentation/gallery-module/gallery-module.component';
import { EquipmentModuleComponent } from './pages/model-presentation/equipment-module/equipment-module.component';
import { DataService } from './services/data.service';
import { UrlsService } from './services/urls.service';
import { UploadPhotoComponent } from './pages/admin-edit/upload-photo/upload-photo.component';
import { CarouselComponent } from './shared/carousel/carousel.component';

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
    AdminEditComponent,
    ModelsGridComponent,
    ModelPresentationComponent,
    DesignModuleComponent,
    GalleryModuleComponent,
    EquipmentModuleComponent,
    UploadPhotoComponent,
    CarouselComponent
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

    ChipsModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    ToolbarModule,
    DropdownModule,
    FileUploadModule,
    OrderListModule,
    PrimeCarouselModule,
    EditorModule,

    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    ButtonsModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot()
  ],
  providers: [
    AuthService,
    MarksService,
    UploadService,
    DataService,
    UrlsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
