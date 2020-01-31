import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  constructor() { }
  validateFields(f: any, neglectedKeys?) {
    if (!neglectedKeys)
      neglectedKeys = {};
    const ls = Object.keys(f);
    for (var key in ls) {
      if (!(ls[Number(key)] in neglectedKeys) && f[ls[Number(key)]].errors)
        return false;
    }
    return true;
  }
  filterDataObj(obj, neglectedKeys?) {
    if (!neglectedKeys)
      neglectedKeys = {};
    let modifiedObj = {};
    for (var key in obj) {
      if (!(key in neglectedKeys)) {
        if (obj[key]) {
          if ((typeof (obj[key]) == "string" && obj[key].trim().length != 0) || typeof (obj[key]) != "string")
            modifiedObj[key] = obj[key];
        }
      }
      else {
        modifiedObj[key] = obj[key];
      }
    }
    return modifiedObj;
  }
  getHeadersFromGroupList(listOfObjs) {
    let headers = [];
    listOfObjs.forEach(group => {
      headers.push(this.trimLastCharFromString(Object.values(group).join("EOF"), "true").replace(/EOF/g, " / \n "));
    });
    return headers;
  }
  getSingleRowDataFromGroupList(groupList, dataObj) {
    let dataRecord = [];
    groupList.forEach((group) => {
      let value = "";
      let l = Object.keys(group).length;
      for (var key in group) {
        if (key != "showKeyInUI") {
          if (group["showKeyInUI"])
            value += key + ": "
          if (key in dataObj && dataObj[key])
            value += dataObj[key]
          else
            value += " NA "
          if (l != 1)
            value += "<br />";
          l -= 1;
        }
      }
      // value = this.trimLastCharFromString(value, "EOF");
      // value = this.trimLastCharFromString(value, "---");
      // value = this.trimLastCharFromString(value, "/");
      // value = value.replace("EOF", " \n");
      dataRecord.push(value);
    });
    return dataRecord;
  }
  getListOfValues(end) {
    return [...Array(end)].map((item, index) => 1 + index);
  }
  trimLastCharFromString(str, chr): string {
    switch (chr) {
      case "EOF": return str.replace(/EOF\s*$/, "");
        break;
      case "---": return str.replace(/---\s*$/, "");
        break;
      case ",": return str.replace(/,\s*$/, "");
        break;
      case "/": return str.replace(/\/\s*$/, "");
        break;
      case " ": return str.replace(/ \s*$/, "");
        break;
      case "true": return this.trimLastCharFromString(str.replace(/true\s*$/, ""), "/");
        break;
    }

    return str;

  }
  getBasePostData() {
    return {
      data: {

      },
      headers: {

      }
    };
  }
  getDateFromDaysBack(days) {
    const data = {
      text: "",
      to: "",
      from: ""
    }
    let currentDate = new Date();
    let pastDate = new Date((currentDate.getTime()) - (days * 24 * 60 * 60 * 1000));
    data.to = this.convertDateToDDMMYYYY(currentDate, '-');
    data.from = this.convertDateToDDMMYYYY(pastDate, '-');
    data.text = this.removeGMTfromDate(pastDate) + " - " + this.removeGMTfromDate(currentDate);
    return data;
  }
  removeGMTfromDate(dateString) {
    dateString = new Date(dateString).toUTCString();
    dateString = dateString.split(' ').slice(0, 5).join(' ');
    return dateString;
  }
  convertDateToDDMMYYYY(date, chr) {
    var dd = date.getDate();
    var MM = date.getMonth() + 1; //January is 0!
    var hh = date.getHours();
    var mm = date.getMinutes();
    var yyyy = date.getFullYear();
    // if (dd < 10) {
    //   dd = '0' + dd;
    // }
    // if (MM < 10) {
    //   MM = '0' + MM;
    // }
    dd = this.handleLessThanZero(dd);
    MM = this.handleLessThanZero(MM);
    hh = this.handleLessThanZero(hh);
    mm = this.handleLessThanZero(mm);
    return dd + chr + MM + chr + yyyy + " " + hh + ":" + mm;

  }
  handleLessThanZero(str) {
    if (str < 10) {
      str = '0' + str;
    }
    return str;
  }
}
