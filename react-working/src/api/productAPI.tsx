import axiosClients from "./axiosClient";

const productAPI = {
  getAll(params: any) {
    const url = "/product";
    return axiosClients.get(url, { params });
  },

  get(id: string) {
    const url = `/product/${id}`;
    return axiosClients.get(url);
  },

  add(data: any) {
    const url = `/product/`;
    return axiosClients.post(url, data);
  },

  update(data: any) {
    const url = `/product`;
    return axiosClients.put(url, data);
  },
};

export default productAPI;
