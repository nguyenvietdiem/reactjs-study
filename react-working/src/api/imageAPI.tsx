import axiosClients from "./axiosClient";

const imageAPI = {
  add(data: any) {
    const url = `/image/upload`;
    return axiosClients.post(url, data);
  },

  delete(data: any) {
    const url = `/image/delete`;
    return axiosClients.post(url, data);
  },
};

export default imageAPI;
