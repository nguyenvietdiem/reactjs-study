import axiosClients from "./axiosClient";

const categoryAPI = {
  getAll(params?: any) {
    const url = "/category";
    return axiosClients.get(url, { params });
  },

  get(id: string) {
    const url = `/category/${id}`;
    return axiosClients.get(url);
  },

  add(data: any) {
    const url = `/category/`;
    return axiosClients.post(url, data);
  },

  update(data: any) {
    const url = `/category`;
    return axiosClients.put(url, data);
  },
};

export default categoryAPI;
