import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheet, ActionSheetOptions, ActionSheetController, PopoverController } from 'ionic-angular';

import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { SocialSharing } from '@ionic-native/social-sharing';

import { DocViewerMenuPage } from '../doc-viewer-menu/doc-viewer-menu'

/**
 * Generated class for the DocViewerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-doc-viewer',
  templateUrl: 'doc-viewer.html',
})
export class DocViewerPage
{
  private document_title: string = 'untitled';
  private document_url:   string = '';
  private document_zoom:  string = '0.4';

  constructor( public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private sess: SessionManagerProvider, private social: SocialSharing, private actionSheetCtrl: ActionSheetController, public popoverCtrl: PopoverController )
  {
    this.document_title = navParams.get('title');
    this.document_url   = navParams.get('document');
  }

  public zoomDocument( ev: any )
  {
    this.document_title = ev;
  }

  /**
   * Present the user with a menu of options for the document
   * @param ev 
   */
  public presentSocialAction( ev )
  {
    let popover = this.popoverCtrl.create( DocViewerMenuPage );

    popover.onDidDismiss(( data: any, role: string ) => {
      switch ( data )
      {

        case 'share':
          this.social.shareViaEmail( '', 'Polynt Composites Documentation', [''], [''], [''], this.navParams.get('document'));
         break;

        case 'print':
          this.alertUser('presentSocialAction','print');
         break;

        default:
          this.alertUser('presentSocialAction', data );
         break;
        
      }
    });

    popover.present({ev});
  }






  public objectToString( obj: any )
  {
    const list: string[] = Object.keys( obj );
    let result: string;

    list.forEach( el => {
      result = result + el + ': ' + obj[ el ] + "; ";
    });

    return( result );
  }
  alertUser( header: string, message: string )
  {
    let alert = this.alertCtrl.create({
      title: header,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    // this.alertUser( 'Error2', this.sess.getDatabase('count'));
  }
}
