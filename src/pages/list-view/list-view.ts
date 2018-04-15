import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetOptions } from 'ionic-angular';
import { Platform, AlertController, ActionSheetController, ActionSheet }   from 'ionic-angular';

import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { DocViewerPage } from '../doc-viewer/doc-viewer';

/**
 * Generated class for the ListViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-view',
  templateUrl: 'list-view.html',
})
export class ListViewPage {
  
  private gui: boolean = false;
  private grouping: boolean = false;

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

  private page_title: string = 'untitled';
  private items: Array<any>;

  constructor( public navCtrl: NavController, public navParams: NavParams, private sess: SessionManagerProvider, private alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, private platform: Platform )
  {
  }

  /**
   * Make a copy of the passed navigation params, this way we can still access
   * the originals in other spots when needed.
   */
  private copyNavParams( obj: any )
  {
    if ( obj === undefined ) { return; }

    const list: string[] = Object.keys( obj );
    let result: any = {};

    list.forEach( el => {
      result[ el ] = obj[ el ];
    });
    
    return( result );
  }


  public presentGroupSelection()
  {
    let data: any = this.sess.getCurrentPathData( this.navParams.data );
    let options: ActionSheetOptions;
    let groupSheet: ActionSheet;

    // Give it a title
    options = {
      'title': 'Group By',
      'buttons': []
    }

    // Set the groups up here
    const list: string[] = Object.keys( data['group'] );

    list.forEach(( idx ) =>
    {
      let temp: any = data['group'][ idx ];

      options['buttons'].push({
        'text': temp['label'],
        'handler': (() => {
          this.buildGroupListData( temp['key'] );
        })
      });
    });

    // Add a cancel option to the list here.
    options.buttons.push({
      'text': 'Cancel',
      'role': 'cancel',
      'handler': () => {}
    });

    // Create and display this action sheet.
    groupSheet = this.actionSheetCtrl.create( options );
    groupSheet.present();
  }



  private ObjectSortArray( obj: any ): any
  {
    if ( obj === undefined ) { return; }

    let tmp: any = [];
    let list: string[] = Object.keys( obj ).sort();

    list.forEach( key => {
      obj[ key ]['icon'] = 'folder';

      tmp.push( obj[ key ] );
    });

    return( tmp );
  }

  private buildGroupList( db: any, group: string ): any
  {
    let list: any = [];
    let temp: any = {};

    // Lets build the group list here
    for ( let key in db )
    {
      let doc_id: string = db[ key ];
      let item:   any    = this.sess.getDocument( doc_id );
      let tag:    string = String( item[ group ] ).toLocaleLowerCase().replace( / /g, '_' );

      /**
       * temp.tag     = 'Tag';
       * temp.example = 'Rxample';
       */
      temp[ tag ] = item[ group ];
    }

    // Extract and sort the keys here
    let data: any = [];

    for ( let key in temp )
    {
      data.push( key );
    }

    data.sort();

    // Finally, let us build the list here
    data.forEach(( key ) =>
    {
      list.push({
        'icon':        'folder',
        'label':       temp[ key ],
        'description': '',
        'groupKey':    group
      })
    });

    return list;
  }

  private buildDocumentList( db: any ): any
  {
    let gKey: string = this.navParams.get('groupKey');
    let gVal: string = this.navParams.get('useGroup');
    let list: any = [];

    for ( let key in db )
    {
      let doc_id: string = db[ key ];
      let item:   any    = this.sess.getDocument( doc_id );

      // Override/add with document
      item['icon'] = 'document';

      if ( item[ gKey ] == gVal )
      {
        list.push( item );
      }
    }

    return list;
  }

  /**
   * Here we decide what page to go to and what params to pass it.
   * 
   * @param item: object = {}
   */
  gotoNextPage( item: any )
  {
    /**
     * copy current navigation params for path, then get the ccurrent depth we
     * are at. this will be used to figure out our index path on the next page. 
     */
    let newParams: any = this.copyNavParams( this.navParams.data );
    let newDepth: number = newParams['depth'];

    //this.alertUser( 'gotoNextPage-item', this.objectToString( item ));
    //this.alertUser( 'gotoNextPage-newParams', this.objectToString( newParams ));

    /**
     * Append the clicked item to the navigation params for use on the next
     * page, this way we always go one level deeper.
     */
    if ( item['groupKey'] == undefined )
    {
      newParams[ newDepth ] = item['key'];
      newParams['depth'] = newDepth + 1;
    }
    else
    {
      // Set the group data here.
      newParams['groupKey'] = item['groupKey'];
      newParams['useGroup'] = item['label'];
    }
    
    /**
     * If the item was a document then push to the viewer page, otherwise we
     * continue using the list/graphic view page.
     */
    if ( item['doc_id'] !== undefined )
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
        this.navCtrl.push( DocViewerPage, {
          'title': data['label'],
          'document': data['path']
        }, {});
        //window.open( data['path'], 'doc_viewer' );
      }
    }
    else
    {
      this.navCtrl.push( ListViewPage, newParams, {});
    }
  }


  /**
   * We can build a special list here for documents that are grouped together.
   * 
   * @param key 
   */
  public buildGroupListData( key: string )
  {
    let data: any = this.sess.getCurrentPathData( this.navParams.data );

    this.items = this.buildGroupList( data['documents'], key );
  }

  private getDefaultGroup( db: any ): string
  {
    let list:   string[] = Object.keys( db );
    let result: string   = '';

    list.forEach(( idx ) =>
    {
      let temp: any = db[ idx ];

      if ( result == '' || temp['default'] )
      {
        result = temp['key'];
      }
    });

    if ( result == '' )
    {
      result = 'label';
    }

    return( result );
  }

  /**
   * Here we get the current path we are traveling, and determin if the page
   * needs to be in the graphic view or list view.
   */
  ionViewDidLoad()
  {
    console.log( this.navParams );

    // Debug
    //this.alertUser( 'ionViewDidLoad-NavParam', this.objectToString( this.navParams.data ));

    /**
     * Request the current path from the database so we have a list of items
     * to display on the page.
     */
    let data: any = this.sess.getCurrentPathData( this.navParams.data );

    // Debug
    //this.alertUser( 'ionViewDidLoad-data', this.objectToString( data ));

    // Set the page title here
    this.page_title = data['label'];

    /**
     * Here we either build a list of document or a list of directories
     * 
     * I would like to eventually make it display both at the same time
     */
    if ( data['documents'] !== undefined )
    {
      // Do we have groups to sort by?
      if ( data['group'] !== undefined )
      {
        // Have we selected a group?
        if ( this.navParams.get('useGroup') != undefined )
        {
          this.page_title = this.navParams.get('useGroup');

          this.items = this.buildDocumentList( data['documents'] );
        }
        else
        {
          // Do we enable the grouping button?
          this.grouping = ( data['group'] != undefined );

          // Get the default group sorting
          let group_key: string = this.getDefaultGroup( data['group'] );

          this.buildGroupListData( group_key );
        }
      }
      else
      {
        this.items = this.buildDocumentList( data['documents'] );
      }
    }
    else
    {
      this.items = this.ObjectSortArray( data['children'] );
    }
  }
}
