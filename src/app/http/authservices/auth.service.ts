import { Injectable } from '@angular/core';

import { HttpconnectService } from './httpconnect.service';
import { UserData } from '../../../models/UserData.model';
import { StaticData } from '../../../models/StaticData.model';
import { AppData } from '../../../models/AppData.model';
import { LsmanagerService } from '../../../services/lsmanager.service';
import { ApiResponseModel } from '../../../models/ApiResponse.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { CookiemanagerService } from '../../../services/cookiemanager.service';
import { appConf } from '../../../configs/app.config';
import { DatamanagerService } from '../../../services/datamanager.service';
import { ToastService } from '../../../services/toast.service';
import { toastmsgs } from '../../../constants/toastmsgs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private onLoadFirstHttpHitForLoginCheck: Boolean = false;
  private isUserAuthenticated: boolean = false;
  private defaultResponse: any = {
    "userData": UserData,
    "staticData": StaticData,
    "appData": AppData,
    "success": false
  };
  private sample: any;
  public logoutHandler: BehaviorSubject<any> = new BehaviorSubject<any>(this.sample);
  public loginHandler: BehaviorSubject<any> = new BehaviorSubject<any>(this.sample);
  public routeLoginCheckHandler: BehaviorSubject<any> = new BehaviorSubject<any>(this.sample);
  public balanceLoaderHandler: BehaviorSubject<any> = new BehaviorSubject<any>(this.sample);
  private getProfileUrl: String = environment["api_url"] + environment["getprofile_api"];
  constructor(private lsmanager: LsmanagerService, private http: HttpconnectService,
    private cookieService: CookiemanagerService,
    private dataMangrSer: DatamanagerService, private toastser: ToastService) { }

  authenticateUserOnLoad(callback) // irrespective of login status , we should send static data to the appLevel  so that , even if user is not logged in static data for app is recieved 
  {
    const finalAPiResModel = this.getBasicApiResponseModel();
    this.isValidSession((apiResModel: ApiResponseModel) => {
      this.onLoadFirstHttpHitForLoginCheck = true;
      if (!apiResModel.apistatus.isSuccess) {
        this.onApiError().then((apiResModel: ApiResponseModel) => {
          this.isUserAuthenticated = false;
          this.routeLoginCheckHandler.next(finalAPiResModel);
          callback(finalAPiResModel);
        });
      }
      else {
        finalAPiResModel.response = apiResModel.response;
        this.routeLoginCheckHandler.next(finalAPiResModel);
        callback(finalAPiResModel);
      }

    });
  }

  onApiError(): Promise<ApiResponseModel> {
    // USER IS NOT LOGGED IN 
    // UNSET DATALAYER,AUTHSERUSERDATA,COOKIEDATA
    return new Promise((resolve) => {
      this.getStaticData((apiResModel: ApiResponseModel) => {
        return resolve(apiResModel);
      });
    });
  }

  reloadPage(err) {
    alert(err);
    window.location.reload();
  }

  getStaticData(callback) { // error handling should be done here 
    const res = null;
    const apiResModel = new ApiResponseModel();
    apiResModel.setApiStatus({ "isSuccess": true });
    apiResModel.response = res.data;
    callback(apiResModel);
    return;
    // if (res.isDataExists) {
    //   apiResModel.setApiStatus({ "isSuccess": true });
    //   apiResModel.response = res.data;
    //   callback(apiResModel);
    // }
    // else {
    //   this.http.invokeGetCall("localhost:3000/getstaticdata").subscribe((data) => {
    //     // modify data
    //     apiResModel.setApiStatus({ "isSuccess": true });
    //     apiResModel.response(data)
    //     callback(apiResModel);
    //   });
    // }
  }



  getisUserAuthenticated(): boolean {
    return this.isUserAuthenticated;
  }


  getProfileCall(payLoad, callback) {
    this.http.invokePostCall(this.getProfileUrl, payLoad, (res) => {
      callback(res);
    });
  }
  logout(sendServerHit = false) {
    if (sendServerHit) {
      if (this.cookieService.getJsessionCookie()["isDataExists"]) {
        let postData = this.getBasicPayLoad();
        postData["headers"] = this.getHeadersForProfileCall(this.cookieService.getJsessionCookie()["data"]);
        this.http.invokePostCall(environment["api_url"] + environment["logout_api"], postData, (res) => {
          console.log("Logged out : " + res);
        });
      }

    }
    this.cleanAllLevelData();
    this.logoutHandler.next(true);

  }
  // GET BASIC VARS 

  getHeadersForProfileCall(wsession) {
    //return { 'wsession': wsession };
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'wsession': wsession,
      'siteid': appConf.siteId
    });
  }
  getHeadersForPreloginCalls() {
    return new HttpHeaders({
      "siteid": "ikkaa",
      'Content-Type': 'application/json'
    });
  }
  getBasicPayLoad() {
    return { "data": {}, "headers": null };
  }
  getBasicApiResponseModel(): ApiResponseModel {
    const finalAPiResModel = new ApiResponseModel();
    finalAPiResModel.setApiStatus({ "isSuccess": true });
    finalAPiResModel.response = this.defaultResponse;
    return finalAPiResModel;
  }
  getOnLoadFirstHttpHitForLoginCheck() {
    return this.onLoadFirstHttpHitForLoginCheck;
  }
  // SET AND CLEAN

  cleanAllLevelData() {
    // clear cookie data 
    this.cookieService.cleanCookies();
    // clear datalayer data 
    this.dataMangrSer.clearAllData();
    //clear this level data
    this.isUserAuthenticated = false;
  }
  setAllLevelData(ssid, profiledata) {
    this.cookieService.setCookie(appConf.wsessionIdKey, ssid);
    this.cookieService.setCookie(appConf.Userdatakeyforcookie, JSON.stringify(profiledata));
    this.dataMangrSer.setUserData(profiledata);
  }

  // PRELOGIN API HITS 
  isValidSession(callback) {
    let apiResModel = new ApiResponseModel();
    // set values in api res model 
    apiResModel.setApiStatus({ "isSuccess": true });
    apiResModel.response = this.defaultResponse;
    if (this.cookieService.getJsessionCookie()["isDataExists"]) {
      const payLoad = this.getBasicPayLoad();
      const wsession = this.cookieService.getJsessionCookie()["data"];
      payLoad.headers = this.getHeadersForProfileCall(wsession);
      this.getProfileCall(payLoad, (profileDataResponse) => {
        if (profileDataResponse["success"]) {
          // SET THIS LEVEL , DATALAYER, COOKIE using data inner var / session storage 
          this.isUserAuthenticated = true;
          this.setAllLevelData(wsession, profileDataResponse);
          apiResModel.apistatus["isSuccess"] = true;
          apiResModel.response = profileDataResponse;
        //  this.loadBalance();
          callback(apiResModel);
        }
        else {
          this.cleanAllLevelData();
          callback(apiResModel);
        }
      });
    }
    else {
      this.cleanAllLevelData();
      return callback(apiResModel);
    }
  }

  login(api, postData, callback) {
    // call api 
    postData["headers"] = this.getHeadersForPreloginCalls();
    this.http.invokePostCall(api, postData, (data) => {
      if (data.success) {
        const payLoad = this.getBasicPayLoad();
        payLoad.headers = this.getHeadersForProfileCall(data["sessionId"]);
        this.getProfileCall(payLoad, (profileDataResponse) => {
          if (profileDataResponse && profileDataResponse["success"]) {
            this.cleanAllLevelData();
            // SET THIS LEVEL , DATALAYER, COOKIE using data inner var / session storage 
            this.isUserAuthenticated = true;
            this.setAllLevelData(data["sessionId"], profileDataResponse);
            this.loginHandler.next(profileDataResponse);
            // this.loadBalance();
            callback(profileDataResponse);
          }
          else { callback({ "success": false }); }
        });

      }
      else
        callback(data);
    });
  }

  register(api, postData, callback) {
    // call api 
    let apiResModel = new ApiResponseModel();
    apiResModel.setApiStatus({ "isSuccess": true });
    apiResModel.response = this.defaultResponse;
    postData["headers"] = this.getHeadersForPreloginCalls();
    this.http.invokePostCall(api, postData, (data) => {
      if (data) {

        if (data.success) {
          const payLoad = this.getBasicPayLoad();
          payLoad.headers = this.getHeadersForProfileCall(data["loginResponse"]["sessionId"]);
          this.getProfileCall(payLoad, (profileDataResponse) => {
            if (profileDataResponse && profileDataResponse["success"]) {
              // SET THIS LEVEL , DATALAYER, COOKIE using data inner var / session storage 
              this.isUserAuthenticated = true;
              this.setAllLevelData(data["loginResponse"]["sessionId"], profileDataResponse);
              this.loginHandler.next(profileDataResponse);
              apiResModel.response = profileDataResponse;
              callback(apiResModel);
            }
            else { // USER GOT CREATED BUT GET PROFILE CALL FAILED 
              this.toastser.showToaster(toastmsgs.profileCallFailOnUserCreation.success, "success");
              apiResModel.response = profileDataResponse;
              callback(apiResModel);
            }
          });
        }
        else {
          apiResModel.response = data;
          callback(apiResModel);
        }
      }
      else {
        callback(apiResModel);
      }

    });
  }

  resetLink(api, postData, callback) {
    const finalAPiResModel = this.getBasicApiResponseModel();
    postData["headers"] = this.getHeadersForPreloginCalls();
    this.http.invokePostCall(api, postData, (res) => {
      if (res) {
        finalAPiResModel.response = res;
        callback(finalAPiResModel);
      }
      else {
        callback(finalAPiResModel);
      }
    });
  }
  getCountriesApicall(callback) {

    const postData = {
      body: {},
      headers: this.getHeadersForPreloginCalls()
    }
    this.http.invokePostCall(environment["api_url"] + environment["get_countries"], postData, (res) => {
      callback(res);
    });
  }
  getCountries(callback) {
    const apiRes = this.getBasicApiResponseModel();
    apiRes.response = { "success": true };
    const localStorageData = this.lsmanager.getDataFromlocalStorage(appConf.countriesDataKey);
    const datamanagerData = this.dataMangrSer.getCountriesList();
    if (localStorageData) {
      if (!datamanagerData)
        this.dataMangrSer.setCountriesList(localStorageData);
      apiRes.response["values"] = localStorageData;
      callback(apiRes);
    }
    else {
      if (datamanagerData) {
        this.lsmanager.setToLocalStorage(appConf.countriesDataKey, datamanagerData);
        apiRes.response["values"] = datamanagerData;
        callback(apiRes);
      }
      else {
        this.toastser.showOverLay("Fetching countries..");
        this.getCountriesApicall((data) => {
          this.toastser.hideOverLay();
          apiRes.response = data;
          if (apiRes.response["success"]) {
            this.lsmanager.setToLocalStorage(appConf.countriesDataKey, data["values"]);
            this.dataMangrSer.setCountriesList(data["values"]);
          }
          else {
            this.toastser.showToaster(toastmsgs.countryFetchError.success, "error");
          }
          callback(apiRes);
        });
      }
    }
  }

  //Post login api hits 
  getDataOnPostCall(api, postData, callback, isHeaderProvided = false) {
    // Develop api post data
    const apiResModel = this.getBasicApiResponseModel();
    if (!isHeaderProvided)
      postData.headers = this.getHeadersForProfileCall(this.cookieService.getJsessionCookie()["data"]);
    this.http.invokePostCall(api, postData, (data) => {
      apiResModel.response = data;
      callback(apiResModel);
    });

  }
  getDataOnBlobPostCall(api, postData, callback) {
    // Develop api post data
    const apiResModel = this.getBasicApiResponseModel();
    this.http.invokePostBlobCall(api, postData, (data) => {
      apiResModel.response = data;
      callback(apiResModel);
    });

  }
  getCampaignCodes(callback) {
    const localData = this.getCampaignListFromLocal();
    if (!localData) {
      const postData = this.getBasicPayLoad();
      postData.headers = {};
      const campaignapi = environment["api_url"] + environment["get_campaigncodes"];
      this.toastser.showOverLay("Fetching campaign list...");
      this.getDataOnPostCall(campaignapi, postData, function (data: ApiResponseModel) {
        this.toastser.hideOverLay();
        let campaignObjects = [];
        if (data && data.apistatus.isSuccess && data.response.campaignObjects) {
          campaignObjects = data.response.campaignObjects;
          this.dataMangrSer.setCampaignList(campaignObjects);
          this.lsmanager.setToLocalStorage(appConf.campaignListDataKey, campaignObjects);
        }
        callback(campaignObjects);
      }.bind(this))
    }
    else
      return callback(localData);
  }
  getCampaignListFromLocal() {
    const lsdata = this.lsmanager.getDataFromlocalStorage(appConf.campaignListDataKey);
    const datamanagerData = this.dataMangrSer.getCampaignList();
    if (lsdata) {
      if (!datamanagerData)
        this.dataMangrSer.setCampaignList(lsdata);
      return lsdata;
    }
    if (datamanagerData) {
      if (!lsdata)
        this.lsmanager.setToLocalStorage(appConf.campaignListDataKey, datamanagerData);
      return datamanagerData;
    }
    return null;
  }

  loadBalance() {
    const api = environment["api_url"] + environment["getNetworkbalance_api"];
    const postData = this.getBasicPayLoad();
    postData.headers = {};
    const res = { status: false, cashbalance: null };
    this.getDataOnPostCall(api, postData, function (data: ApiResponseModel) {
      if (data && data.apistatus.isSuccess && data.response.success) {
        if (data.response.values["agentStatistics"] && Object.keys(data.response.values["agentStatistics"]).length > 0) {
          const key = Object.keys(data.response.values["agentStatistics"])[0];
          if (data.response.values["agentStatistics"][key]["CASHBALANCE"])
            res.cashbalance = data.response.values["agentStatistics"][key]["CASHBALANCE"];
          res.status = true;
        }
      }
      this.balanceLoaderHandler.next(res);
    }.bind(this));
  }
  getCampaignLists(callback) {
    const localData = this.getCampaignListsFromLocal();
    if (!localData) {
      const postData = this.getBasicPayLoad();
      postData.headers = {};
      const campaignapi = environment["api_url"] + environment["campaignList"];
      this.toastser.showOverLay("Fetching campaign list...");
      this.getDataOnPostCall(campaignapi, postData, function (data: ApiResponseModel) {
        this.toastser.hideOverLay();
        let campaignObjects = [];
        if (data && data.apistatus.isSuccess && data.response.campaignObjects) {
          campaignObjects = data.response.campaignObjects;
          this.dataMangrSer.setCampaignList(campaignObjects);
          this.lsmanager.setToLocalStorage(appConf.campaignListDataKey, campaignObjects);
        }
        callback(campaignObjects);
      }.bind(this))
    }
    else
      return callback(localData);
  }
  getCampaignListsFromLocal() {
    return null;
    const lsdata = this.lsmanager.getDataFromlocalStorage(appConf.campaignListDataKey);
    const datamanagerData = this.dataMangrSer.getCampaignList();
    if (lsdata) {
      if (!datamanagerData)
        this.dataMangrSer.setCampaignList(lsdata);
      return lsdata;
    }
    if (datamanagerData) {
      if (!lsdata)
        this.lsmanager.setToLocalStorage(appConf.campaignListDataKey, datamanagerData);
      return datamanagerData;
    }
    return null;
  }

}