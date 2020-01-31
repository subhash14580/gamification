import { Injectable } from '@angular/core';
import { appConf } from '../configs/app.config';

@Injectable({
  providedIn: 'root'
})
export class LsmanagerService {

  private lsObj: any;
  constructor() {

  }
  getDataFromlocalStorage(key): any {
    if (appConf.lskey in localStorage) {
      let localData = JSON.parse(localStorage[appConf.lskey]);
      if (key in localData)
        return localData[key];
      return null;
    }
    return null;
  }
  setToLocalStorage(key, value) {
    if (!(appConf.lskey in localStorage))
      localStorage[appConf.lskey] = "{}";
    let lsData = JSON.parse(localStorage[appConf.lskey])
    lsData[key] = value;
    localStorage[appConf.lskey] = JSON.stringify(lsData);
  }
}
