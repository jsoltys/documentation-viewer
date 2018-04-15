import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DownloadManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DownloadManagerProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DownloadManagerProvider Provider');
  }

}
