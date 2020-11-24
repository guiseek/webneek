import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DemosComponent } from './demos.component';
import { PeerConnectionComponent } from './peer-connection';
import { SdpStepsComponent } from './sdp-steps';

const routes: Routes = [
  { path: '', redirectTo: 'sdp-steps' },
  { path: '', component: DemosComponent },
  { path: 'sdp-steps', component: SdpStepsComponent },
  { path: 'peer-connection', component: PeerConnectionComponent },
];

@NgModule({
  declarations: [DemosComponent, SdpStepsComponent, PeerConnectionComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DemosModule {}
