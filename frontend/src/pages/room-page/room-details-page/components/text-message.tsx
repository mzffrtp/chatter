import formatMessageTime from "../../../../utils/date-formatter";

export type TextMessagePropsType = {
  message: string;
  senderName: string;
  messageTime: Date;
  //todo other propertiees?
};
export default function TextMessage(props: TextMessagePropsType) {
  const formattedTime = formatMessageTime(props.messageTime);
  return (
    <div className="d-flex flex-row justify-content-start">
      <img
        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
        alt="avatar 1"
        style={{ width: "45px", height: "100%" }}
      />

      <div>
        <strong className="small ms-3 mb-1 rounded-3 text-muted w-100">
          {props.senderName}
        </strong>
        <p
          className="small p-2 ms-3 mb-1 rounded-3"
          style={{ backgroundColor: "#f5f6f7" }}
        >
          {props.message}
        </p>
        <p className="small ms-3 mb-1 rounded-3 text-muted float-end">
          {formattedTime}
        </p>
      </div>
    </div>
  );
}
