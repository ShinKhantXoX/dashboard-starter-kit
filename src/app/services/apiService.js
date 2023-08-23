import { http } from "../config/axios";

const urlParams = (params) => {
    let paramsArray = [];
    Object.keys(params).map((value) => {
        return paramsArray.push(`${value}=${params[value]}`);
    });
    return paramsArray.join("&");
}

const httpReqestHandler = (errors) => {

    if(errors.response && errors.response.status === 422) {
        return {
            status : errors.response.status,
            message: errors.response.data.message,
            errors: errors.response.data.data
        }
    }

    if(errors.response && (errors.response.status === 500 || errors.response.status === 403)) {
        return {
            status : errors.response.status,
            message: errors.response.data.message,
        }
    }

    if(errors.response && errors.response.status === 401) {
        localStorage.removeItem("token");
        window.location.replace('/auth/login')
    }

    return errors;
}

const httpResponseHandler = (response) => {
    return {
        status : 200,
        message: response.data.message,
        data: response.data.data
    };
}


export const getReqeust = async (path, params) => {

    const url = params ? `${path}?${urlParams(params)}` : path;
    return await http.get(url)
        .then((response) => httpResponseHandler(response))
        .catch((error) => httpReqestHandler(error));
}

export const postRequest = async (path, body) => {
    return await http.post(path, body)
        .then((response) => { return httpResponseHandler(response)})
        .catch((error) => {return httpReqestHandler(error)});
}

export const putRequest = async (path, body) => {
    return await http.put(path, body)
    .then((response) => httpResponseHandler(response))
    .catch((error) => httpReqestHandler(error));
}

export const delRequest = async (path) => {
    return await http.delete(path)
    .then((response) => httpResponseHandler(response))
    .catch((error) => httpReqestHandler(error));
}
