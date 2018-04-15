import { HttpClient }   from '@angular/common/http';
import { Injectable }   from '@angular/core';
import { File }         from '@ionic-native/file';
import { FileTransfer, FileTransferObject, FileTransferError } from '@ionic-native/file-transfer'

import { Platform, AlertController }   from 'ionic-angular';

/**
 * 
 */
const var_name: any = {
  'database': 'database.json',
  'document': 'download',
  'down_log': 'download log.txt'
};

const uri: any = {
  'protocol': 'http',
  'domain':   'www2.teamci.org',
  'path':     'ev.nsf',
  'file':     'composites.json'
}

/*
  Generated class for the SessionManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SessionManagerProvider {
  private database:  any = null; // Current active database
  private temporary: any = null; // Downloaded database
  private docTable:  any = null;

  private os: string = '';
  private local: string = '';

  public tempValue: string;

  public objectToString( obj: any )
  {
    const list: string[] = Object.keys( obj );
    let result: string = '';

    list.forEach( el => {
      result = result + el + ': ' + obj[ el ] + "; ";
    });

    return( result );
  }
  public notifyUser( header: string, message: string )
  {
    let alert = this.alertCtrl.create({
      title: header,
      subTitle: message,
      buttons: ['OK']
    });

    alert.present();
  }

  private server_doc_path( doc_id: number, doc_name: string )
  {
    const result: string = this.database.domain + '/0/' + doc_id + '/$FILE/' + doc_name.replace(/ /g, '+');

    return( result );
  }

  private buildURI(): string
  {
    let result: string = '';

    result = result + uri.protocol + '://';

    if ( uri.protocol === 'file' ) { result = result + uri.protocol + '/'; }

    result = result + uri.domain   + '/';
    result = result + uri.path     + '/';
    result = result + uri.file;

    return( result );
  }

  private setWorkingDirectory()
  {
    if ( this.local != '' )
    {
      //return;
    }

    // Set the base storage for the device.
    if ( this.platform.is('ios'))
    {
      this.local = this.file.dataDirectory;
      this.os = 'ios';
    }
    else if ( this.platform.is('android'))
    {
      this.local = this.file.externalDataDirectory;
      this.os = 'android';
    }
    else
    {
      this.local = this.file.dataDirectory;
      this.os = 'unknown';
    }

    // Create folders.
    this.file.createDir( this.local, var_name.document, false )
    .catch(( err: any ) => {
      //this.notifyUser( 'createDir1', err );
    })
    .catch(( err: any ) => {
      //this.notifyUser( 'createDir2', err );
    });
  }

  constructor( public http: HttpClient, public alertCtrl: AlertController, public file: File, private platform: Platform, public transfer: FileTransfer ) {
    if ( this.database === null )
    {
      this.database  = null; // Clear the database.
      this.temporary = null; // Clear the tempoary database.

      this.setWorkingDirectory();
      
      // Load the local database
      this.loadDatabase();
    };
  }

  // Get access to the current database.
  public getDatabase(): any
  {
    return( this.database );
  };

  // Build the lookup table once per session
  public buildDocumentTable()
  {
    if ( this.docTable == null )
    {
      this.docTable = [];

      const list: string[] = Object.keys( this.database['document'] );

      list.forEach(( key ) =>
      {
        this.docTable.push( key );
      });
    }
  }

  public getDocumentCount(): number
  {
    this.buildDocumentTable();

    return( this.docTable.length );
  }
  public getDocumentByIdx( uid: number ): any
  {
    this.buildDocumentTable();
    
    return this.getDocument( this.docTable[ uid ] );
  }
  public getDocument( uid: string ): any
  {
    return( this.database['document'][ uid ] );
  };
  public getDocumentPath( uid: string ): any
  {
    this.setWorkingDirectory();

    const doc: any = this.getDocument( uid );
    let doc_path: string = '';

    if ( this.platform.is('cordova'))
    {
      doc_path = this.local + '/' + var_name.document + '/' + doc['pdf'];
    }
    else
    {
      doc_path = this.server_doc_path( doc['doc_id'], doc['pdf'] );
    }

    return({
      'title': doc['pdf'],
      'label': doc['label'],
      'path': doc_path
    });
  }

  // Save the current database to the device.
  public saveDatabase()
  {
    this.setWorkingDirectory();

    this.file.writeExistingFile( this.local, var_name.database, JSON.stringify( this.database ))
    .then(( data: any ) => {
      /**
       * data.
       * 
       * isFile: boolean
       * isDirectory: boolean
       * name: string
       * fullPath: string
       * filesystem: object
       * nativeURL: string
       */
    }, ( err: any ) => {
      // Most likely a FILE_NOT_FOUND error, meaning that the file does not exist.
      //this.notifyUser( 'saveDatabase error!', err.message );
    })
    .catch(( err ) => {
      //this.notifyUser( 'saveDatabase catch!', err.message );
    });
  };


  // Log downloads
  private downloadLog: string = '';

  private saveLog()
  {
    this.setWorkingDirectory();

    this.file.writeExistingFile( this.local, var_name.down_log, this.downloadLog )
    .then(( data: any ) => {}, ( err: any ) => {
      // Most likely a FILE_NOT_FOUND error, meaning that the file does not exist.
      //this.notifyUser( 'saveLog error!', err.message );
    })
    .catch(( err ) => {
      //this.notifyUser( 'saveLog catch!', err.message );
    });
  }

  private appendToLog( text: string )
  {
    this.downloadLog = text + "\n" + this.downloadLog;
    this.saveLog();
  }

  // Download marked document
  private downloadList: string[];

  private skipCount: number = 0;
  private downloadCount: number = 0;
  private redoCount: number = 0;
  private totalCount: number = 0;

  private downloadManager()
  {
    this.setWorkingDirectory();

    // Have we hit our download limit?
    if ( this.downloadCount >= 2 )
    {
      return;
    };

    // Was the last item downloaded?
    if ( this.downloadList.length == 0 ) {
      let msg: string = ''
      
      msg += 'Skips: ' + String( this.skipCount  ) + "\n";
      msg += 'Fails: ' + String( this.redoCount  ) + "\n";
      msg += 'Total: ' + String( this.totalCount ) + "\n";
      
      this.appendToLog( msg );
      //this.notifyUser( 'Download Status', msg );

      return;
    }

    // Get an item key to search for
    let key: string = this.downloadList.pop();

    // See if the file need to be downloaded
    if ( this.database['document'][ key ]['download'] == true )
    {
      const fdata: any = this.database['document'][ key ]

      const manager: FileTransferObject = this.transfer.create();

      const source: string = this.server_doc_path( fdata['doc_id'], fdata['pdf'] );
      const target: string = this.local + '/' + var_name.document + '/' + fdata['pdf'];

      // Request the download
      const download = manager.download( source, target, true, {
        replace: true
      })
      .then(( result: any ) => {
        this.downloadCount -= 1;
        this.appendToLog( 'Downloaded -- ' + this.database['document'][ key ]['pdf'] );
        
        this.database['document'][ key ]['download'] = false;
        this.saveDatabase();

        this.downloadManager();
      }, ( reason: any ) => {
        this.downloadCount -= 1;
        this.appendToLog( 'Error -- ' + this.database['document'][ key ]['pdf'] );

        this.downloadList.push( key );
        this.redoCount += 1;

        this.downloadManager();
      })
      .catch(( err: FileTransferError ) => {
        this.downloadCount -= 1;
        this.appendToLog( 'Catch -- ' + this.database['document'][ key ]['pdf'] + "\n\r" + err.body );

        this.downloadManager();
      });

      this.downloadCount += 1;
      this.totalCount += 1;
    }
    else if ( this.downloadCount < 2 )
    {
      this.downloadManager();
    };
  };








  // Get current data
  public getCurrentPathData( data: any ): any
  {
    const depth: number = data['depth'];

    let newData: any = this.database.index;
    let step: number = 0;
    let offset: number = 0;

    for( step = 0; step < depth; step += 1 )
    {
      if ( step > 0 )
      {
        newData = newData['children'];
      }
      
      newData = newData[ data[ step ]];
    }

    //this.notifyUser( 'getCurrentPathData1', step + ' ::: ' + this.objectToString( data ));
    //this.notifyUser( 'getCurrentPathData2', step + ' ::: ' + this.objectToString( newData ));

    return( newData );
  }










  // Update the current database with the temporary database.
  private updateDatabase()
  {
    this.database = this.temporary;
    
    this.downloadList = Object.keys( this.database['document'] );

    this.saveDatabase();
    this.downloadManager();
  };

  // Compare documents.
  private compareDocumentDate( key )
  {
    const ddate1: number = this.temporary['document'][ key ]['modified'];
    const tdate1: number = this.temporary['document'][ key ]['modified'];

    // create timestame here
    const ddate2: Date = new Date( ddate1 );
    const tdate2: Date = new Date( tdate1 );

    return( tdate2 > ddate2 );
  };

  private compareDocument()
  {
    this.setWorkingDirectory();

    let tlist = Object.keys( this.temporary['document'] );

    if ( this.database !== null )
    {
      tlist.forEach(( key ) => {
        if ( this.database['document'][ key ] !== null )
        {
          let uri_path: string = this.local + var_name.document;
          let uri_file: string = this.database['document'][ key ]['pdf'];

          if ( this.compareDocumentDate( key ) || this.database['document'][ key ].download )
          {
            this.temporary['document'][ key ].download = true;
          };
        }
        else
        {
          this.temporary['document'][ key ].download = true;
        }
      });
    }
    else
    {
      tlist.forEach(( key ) => {
        this.temporary['document'][ key ].download = true;
      });
    }

    this.updateDatabase();
  }

  // Request an update from the server.
  private requestUpdate()
  {
    this.http.get( this.buildURI())
    .subscribe(( data: any ) => {
      this.temporary = data;
      this.compareDocument();
    }
    ,( data: any ) => {
      /**
       * headers: object
       * status: integer
       * statusText: string
       * url: ???
       * ok: boolean
       * name: HttpErrorResponse
       * message: string
       * error: object[ProgressEvent]
       */
      //this.notifyUser( 'requestUpdate2', this.objectToString( data ));
    });
  };

  // Open the database currently saved on the device.
  private loadDatabase()
  {
    this.setWorkingDirectory();

    this.file.readAsText( this.local, var_name.database )
    .then(( data: string ) => {
      this.database = JSON.parse( data );

      this.requestUpdate();
    }, ( err: any ) => {
      // Most likely a FILE_NOT_FOUND error, meaning that the file does not exist.
      this.requestUpdate();
    })
    .catch(( err ) => {
      //this.notifyUser( 'readastext catch!', err.message );
    });
  };
}
