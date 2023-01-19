import axios from "axios";

const api = axios.create({
  baseURL: "https://prolococasteo.altervista.org/index.php",
});

export default api;
