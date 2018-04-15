import { Component } from '@angular/core';
import { ViewController, IonicPage, AlertController } from 'ionic-angular';

/**
 * Generated class for the DocViewerMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-doc-viewer-menu',
  templateUrl: 'doc-viewer-menu.html',
})
export class DocViewerMenuPage {
  private printable: boolean = false;

  constructor( public viewCtrl: ViewController, private alertCtrl: AlertController )
  {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocViewerMenuPage');
  }

  public printDocument()
  {
    this.viewCtrl.dismiss('print');
  }

  public shareDocument()
  {
    this.viewCtrl.dismiss('share');
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

}
