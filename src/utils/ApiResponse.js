class ApiResponse{
    constructor(statusCode,data,meassage="Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = meassage;
        this.success = statusCode < 400;
    }
}


export {ApiResponse};