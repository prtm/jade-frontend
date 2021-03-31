/* eslint-disable */
import axios from 'axios';

const API_SERVER = process.env.VUE_APP_SERVER_URL;

export const apiCall = ({ url, method, ...args }) =>
    new Promise((resolve, reject) => {
        const serverUrl = API_SERVER + url;
        try {
            axios({
                method: method || 'get',
                url: serverUrl,
                ...args,
            })
                .then((resp) => {
                    resolve(resp.data);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (err) {
            reject(new Error(err));
        }
    });