import { ChatMessages } from "../../components/messages/ChatMessages";
import useInput from "../../hooks/useInput";

export function ChattingPage() {
  const handleSubmit = (value) => {
    // 여기에서 value를 사용하여 요청을 보냅니다.
    console.log("Submitting:", value);
  };

  const inputProps = useInput("", handleSubmit);
  return (
    <div>
      <ChatMessages />
      <input
        type="text"
        {...inputProps}
        placeholder="Enter text and press Enter"
      />
    </div>
  );
}

export default ChattingPage;
