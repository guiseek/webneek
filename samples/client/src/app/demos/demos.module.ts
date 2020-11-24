import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DemosComponent } from './demos.component';
import { SdpStepsComponent } from './sdp-steps/sdp-steps.component';

const routes: Routes = [
  { path: '', redirectTo: 'sdp-steps' },
  { path: '', component: DemosComponent },
  { path: 'sdp-steps', component: SdpStepsComponent },
];

@NgModule({
  declarations: [DemosComponent, SdpStepsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DemosModule {}
