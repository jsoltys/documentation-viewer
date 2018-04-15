import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GraphicViewPage } from './graphic-view';

@NgModule({
  declarations: [
    GraphicViewPage,
  ],
  imports: [
    IonicPageModule.forChild(GraphicViewPage),
  ],
})
export class GraphicViewPageModule {}
