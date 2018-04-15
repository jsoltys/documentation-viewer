import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController }   from 'ionic-angular';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { DocViewerPage } from '../doc-viewer/doc-viewer';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage
{
  private items: Array<any>;

  // Debug Start ==============================================================
  public objectToString( obj: any )
  {
    if ( obj === undefined ) { return ''; }

    const list: string[] = Object.keys( obj );
    let result: string = '';

    list.forEach( el => {
      result = result + el + ': ' + obj[ el ] + "\n";
    });

    return( result );
  }

  public alertUser( header: string, message: string )
  {
    let alert = this.alertCtrl.create({
      title: header,
      subTitle: message,
      buttons: ['OK']
    });

    alert.present();
  }
  // Debug End ================================================================
  
  constructor( public navCtrl: NavController, public navParams: NavParams, private sess: SessionManagerProvider, private alertCtrl: AlertController, private platform: Platform )
  {
  }

  public testKey( ev: any )
  {
    if ( ev['key'] == "enter" )
    {
      console.log( ev );
      this.alertUser( 'textKey', ev['key'] );
    }
  }

  /**
   * Here we decide what page to go to and what params to pass it.
   * 
   * @param item: object = {}
   */
  gotoNextPage( item: any )
  {
    const data: any = this.sess.getDocumentPath( item['doc_id'] );

    if ( this.platform.is('cordova'))
    {
      this.navCtrl.push( DocViewerPage, {
        'title': data['label'],
        'document': data['path']
      }, {});
    }
    else
    {
      window.open( data['path'], 'doc_viewer' );
    }
  }

  // Compare Values
  private compareValue( value1: string, value2: string ): boolean
  {
    let result: boolean = false;

    if ( value1 !== undefined && value2 !== undefined && value1 !== '' )
    {
      //console.log( value1, value2, value1.indexOf( value2 ));
      result = ( -1 < value2.indexOf( value1 ));
    }

    return( result );
  }
  
  private searchItems( ev: any )
  {
    let searchValue: string = ev.target.value;
    let limit:       number = this.sess.getDocumentCount();

    // Clear
    this.items = [];

    // Only search if not empty
    if ( searchValue == '' )
    {
      return;
    }

    // Convert to uppercase
    searchValue = searchValue.toLocaleUpperCase();

    // Start search
    for ( let idx: number = 0; idx < limit; idx++ )
    {
      let temp: any = this.sess.getDocumentByIdx( idx );

      if ( this.compareValue( searchValue, temp['label'].toLocaleUpperCase()) ||
           this.compareValue( searchValue, temp['series'].toLocaleUpperCase()) ||
           this.compareValue( searchValue, temp['section_child'].toLocaleUpperCase()) ||
           this.compareValue( searchValue, temp['trade'].toLocaleUpperCase()) ||
           this.compareValue( searchValue, temp['product'].toLocaleUpperCase()) ||
           this.compareValue( searchValue, temp['series'].toLocaleUpperCase()))
      {
        this.items.push( temp );
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
}
