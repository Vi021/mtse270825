import axios from './axios.customize';


const createUserApi = (name, email, password) => {
    const URL_API = "/api/register";
    const data = { name, email, password };
    
    return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
    const URL_API = "/api/login";
    const data = { email, password };

    return axios.post(URL_API, data);
};

const getUserApi = () => {
    const URL_API = `/api/user`;

    return axios.get(URL_API);
};

const getProductApi = (offset, limit, filters = {}) => {
    const URL_API = `/api/products`;
    return axios.get(URL_API, {
        params: { offset, limit, ...filters }
    });
};

const getProductById = (id) => {
    const URL_API = `/api/products/${id}`;
    return axios.get(URL_API);
};

const addProduct = (data) => {
    const URL_API = `/api/products/add`;
    return axios.post(URL_API, data);
};

const updateProduct = (id, data) => {
    const URL_API = `/api/products/update/${id}`;
    return axios.put(URL_API, data);
};

const deleteProduct = (id) => {
    const URL_API = `/api/products/remove/${id}`;
    return axios.delete(URL_API);
};

export {
    createUserApi,
    loginApi,
    getUserApi,
    getProductApi,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};