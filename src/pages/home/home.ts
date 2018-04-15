import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { GraphicViewPage } from '../graphic-view/graphic-view';
import { ListViewPage } from '../list-view/list-view';
import { NewsFeedPage } from '../news-feed/news-feed';
import { DocViewerPage } from '../doc-viewer/doc-viewer';
import { SearchPage } from '../search/search';

import { SessionManagerProvider } from '../../providers/session-manager/session-manager';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private key_id: string = 'None';

  constructor( public navCtrl: NavController, public alertCtrl: AlertController, private sess: SessionManagerProvider )
  {
    
  }

  // Used to debug
  notifyPageName( header: string, message: string )
  {
    let alert = this.alertCtrl.create({
      title: header,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  captureKeypress()
  {
    /*
    const list: string[] = Object.keys( ev );
    let   temp: string   = '';

    list.forEach( key => {
      temp += key + ": " + ev[ temp ] + ";  ";
    });
    */

    this.key_id = 'Key Prossed: enter';
  }

  loadPage( sectionType: string, params: string = '' )
  {
    switch( sectionType )
    {

      case 'search':
        this.navCtrl.push( SearchPage, {}, {});
       break;
      
      case 'special':
        this.navCtrl.push( GraphicViewPage, {
          '0': params,
          'depth': 1,
          'gui': 'false'
        }, {});
       break;

      case 'navigation':
        this.navCtrl.push( ListViewPage, {
          '0': params,
          'depth': 1,
          'gui': 'false'
        }, {});
       break;

      case 'news':
        this.navCtrl.push( NewsFeedPage, {
          'params': params
        }, {});
       break;

      case 'viewer':
        const data: any = this.sess.getDocumentPath('C1800205132BB9F786257F780064DD2F');

        this.navCtrl.push( DocViewerPage, {
          'title': data['title'],
          'document': data['path']
        }, {});
       break;

      default:
        this.notifyPageName( 'Unknown Page Type', sectionType );
       break;
      
    }
  }
}
