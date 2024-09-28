import axios from "axios";
import { config } from "../config/config";
// import { applyInterceptors } from "./interceptor";

//.env로 숨긴 url 주소 (backend 주소 <-> front 주소)
const BASE_URL = process.env.REACT_APP_BACKEND_SERVER_URL;

//디폴트 주소에 대한 인스턴스 제공
const defaultInstance = axios.create({
  baseURL: BASE_URL,
});

//디폴트 주소에서 하나 더 붙은 인스턴스를 제공해준다.
const exampleInstance = axios.create(defaultInstance.defaults);
exampleInstance.defaults.baseURL += "/example";

// '/api/v1/rooms' 경로를 위한 인스턴스
const roomsInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1/rooms`,
  withCredentials: config.withCredentials,
});

// '/api/v1/rooms' 경로를 위한 인스턴스
const oauth2 = axios.create({
  baseURL: `${BASE_URL}/oauth2/authorization/kakao
  `,
});
// applyInterceptors(exampleInstance);

export { defaultInstance, exampleInstance, roomsInstance, oauth2 };
