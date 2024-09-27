import { useSetRecoilState } from "recoil";
import { exampleState } from "../../recoil/user/userRecoilState";
import { sendRequest } from "../request";
import { exampleInstance } from "../instance";

export const useExampleHook = () => {
  //recoil은 전역 변수 상태 관리 라이브러리로 사용을 한다.
  const setExampleState = useSetRecoilState(exampleState);

  const exampleGet = async (exampleData) => {
    //디폴트 주소 + /example 에다가 API 요청을 할 건데, get 요청을 할 거다 +  그 뒤에 붙는 주소는 / 이다 .
    const response = await sendRequest(
      exampleInstance,
      "get",
      "/",
      exampleData
    );

    //전역 변수에 대해서는 response.data 라는 코드를 통해서 데이터를 저렇게 설정해주고, 설정해준 전역 변수이기에 바로 View 단에서 가져와서 사용한다.  -> Prop Drilling 쉽게 해결해준다.

    setExampleState(response.data);
    //return 은 단지 잘 왔나 확인할 때 쓰는 용도 안 쓸 때도 있음
    return response;
  };

  return {
    exampleGet,
  };
};
