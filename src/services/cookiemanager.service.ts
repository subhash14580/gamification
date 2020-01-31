import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { appConf } from '../configs/app.config';


@Injectable({
  providedIn: 'root'
})
export class CookiemanagerService {
  private dataStatus: any = { isDataExists: false, data: null };
  constructor(private cookieService: CookieService) { }
  setCookie(key, val?) {
    if (typeof (key) == "object") {
      const cookieJson = JSON.parse(key);
      for (var ckey in cookieJson) {
        let val = cookieJson[ckey];
        val = val == "jsessionid" ? this.encrypt(val) : val;
        this.cookieService.set(key, val);
      }
    }
    else {
      val = key == appConf.wsessionIdKey ? this.encrypt(val) : val;
      this.cookieService.set(key, val)
    }

  }
  getCookie(key) {
    this.dataStatus.data = null;
    if (!this.cookieService.check(key))
      this.dataStatus.isDataExists = false;
    else {
      this.dataStatus.data = this.cookieService.get(key);
      this.dataStatus.isDataExists = true;
    }
    return this.dataStatus;
  }
  getJsessionCookie() {
    const jskey = appConf.wsessionIdKey;
    this.dataStatus.data = null;
    if (!this.cookieService.check(jskey) || this.cookieService.get(jskey).length == 0)
      return this.dataStatus.isDataExists = false;
    else {
      const jsessionid = this.cookieService.get(jskey);
      if (jsessionid.length == 0)
        return this.dataStatus.isDataExists = false && this.dataStatus;
      this.dataStatus.isDataExists = true;
      this.dataStatus.data = this.decrypt(jsessionid);
    }
    return this.dataStatus;
  }
  private encrypt(str) {
    return str;
  }
  private decrypt(str) {
    return str;
  }
  cleanCookies() {
    this.cookieService.deleteAll();
  }
}
