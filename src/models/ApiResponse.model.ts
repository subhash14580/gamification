export class ApiResponseModel {
    "apistatus": any = {
        "isSuccess": null,
        "errorCode": null,
        "errorMessage": null
    };
    "response": any = null;
    constructor() {

    }
    setApiStatus(obj) {
        for (var key in obj)
            this.apistatus[key] = obj[key];
    }
    setResponse(res) {
        this.response = res;
    }

}