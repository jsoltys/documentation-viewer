import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ContentsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContentsProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ContentsProvider Provider');
  }

}
