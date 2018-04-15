import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocViewerMenuPage } from './doc-viewer-menu';

@NgModule({
  declarations: [
    DocViewerMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(DocViewerMenuPage),
  ],
})
export class DocViewerMenuPageModule {}
