import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './pages/main/main.component';
import { NewCarsComponent } from './pages/new-cars/new-cars.component';
import { FundingComponent } from './pages/funding/funding.component';
import { TradeInComponent } from './pages/trade-in/trade-in.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { GuaranteeComponent } from './pages/guarantee/guarantee.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminEditComponent } from './pages/admin-edit/admin-edit.component';
import { ModelPresentationComponent } from './pages/model-presentation/model-presentation.component';
import { FinanceCalculatorComponent } from './pages/funding/finance-calculator/finance-calculator.component';
import { FinanceConditionsComponent } from './pages/funding/finance-conditions/finance-conditions.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: MainComponent },
  { path: 'new-cars', component: NewCarsComponent },
  { path: 'funding', component: FundingComponent },
  { path: 'trade-in', component: TradeInComponent },
  { path: 'guarantee', component: GuaranteeComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin-edit', component: AdminEditComponent },
  { path: 'model-presentation', component: ModelPresentationComponent },
  { path: 'finance-calculator', component: FinanceCalculatorComponent },
  { path: 'finance-conditions', component: FinanceConditionsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
