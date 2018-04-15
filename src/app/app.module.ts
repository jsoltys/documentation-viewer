import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file'
import { FileTransfer } from '@ionic-native/file-transfer';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PopoverController } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GraphicViewPage } from '../pages/graphic-view/graphic-view';
import { ListViewPage } from '../pages/list-view/list-view';
import { NewsFeedPage } from '../pages/news-feed/news-feed';
import { DocViewerPage } from '../pages/doc-viewer/doc-viewer';
import { DocViewerMenuPage } from '../pages/doc-viewer-menu/doc-viewer-menu';

import { IonicStorageModule } from '@ionic/storage';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ContentsProvider } from '../providers/contents/contents';
import { DownloadManagerProvider } from '../providers/download-manager/download-manager';
import { SearchPage } from '../pages/search/search';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GraphicViewPage,
    ListViewPage,
    NewsFeedPage,
    DocViewerPage,
    DocViewerMenuPage,
    SearchPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PdfViewerModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GraphicViewPage,
    ListViewPage,
    NewsFeedPage,
    DocViewerPage,
    DocViewerMenuPage,
    SearchPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FileTransfer,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ContentsProvider,
    DownloadManagerProvider
  ]
})
export class AppModule {}
