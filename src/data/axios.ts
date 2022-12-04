import axios from "axios";

const api = axios.create({
  baseURL: "http://prolococasteo.altervista.org/index.php",
});

export default api;
