import axios from "../data/axios";

export const getImgName = (url: string) =>
  url.slice(url.lastIndexOf("/") + 1, url.indexOf("."));

// not used at the moment
export const getImageAsFile = async (
  url: string,
  fileName = getImgName(url)
) => {
  const response = await axios.get(url, {
    responseType: "blob",
  });
  const mimeType = response.headers["content-type"];
  return new File([response.data], fileName, { type: mimeType });
};
