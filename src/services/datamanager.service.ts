import { Injectable } from '@angular/core';
import { AppData } from '../models/AppData.model';
import { UserData } from '../models/UserData.model';

@Injectable({
  providedIn: 'root'
})
export class DatamanagerService {

  constructor() { }
  // private userData: UserData; // user personal data is stored here
  private userData: any = null;
  private captchaData: Blob = null;
  private appData: AppData; // app data such as numberOfPlayersOnline etc,
  private countriesList: any = null;
  private campaignList: any = null;
  // getter and setter should be added below 
  getUserData() {
    return this.userData;
  }
  setUserData(data: UserData) {
    this.userData = data;
  }
  getAppData() {
    return this.appData;
  }
  setAppData(data: AppData) {
    this.appData = data;
  }
  setCaptchaData(data: Blob) {
    this.captchaData = data;
  }
  getCaptchaData() {
    return this.captchaData;
  }
  setCountriesList(data) {
    this.countriesList = data;
  }
  getCountriesList() {
    return this.countriesList;
  }
  getCampaignList() {
    return this.campaignList;
  }
  setCampaignList(data) {
    this.campaignList = data;
  }
  clearAllData() {
    this.userData = null;
    this.captchaData = null;
  }
}
