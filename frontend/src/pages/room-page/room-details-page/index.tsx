import { Form, Button, InputGroup, ListGroup } from "react-bootstrap";

import { formJson } from "../../../utils/functions";
import TextMessage from "./components/text-message";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { chatHttpApi } from "../../../utils/api";

export default function RoomDetailsPage() {
  const onChatFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = formJson(e.currentTarget);
    console.log("🚀 ~ onChatFormSubmit ~ formData:", formData);
    alert("meesage sent");
  };

  const params = useParams();
  console.log("🚀 ~ RoomDetailsPage ~ params:", params);

  useEffect(() => {
    (async () => {
      try {
        //! get room details
        const api = chatHttpApi();
        const roomDetailsResponse = await api.get(
          "/room/getById/" + params.roomId
        );
        console.log("🚀 ~ getRoomResponse:", roomDetailsResponse);

        //! get room messages
        const lastMessagesResponse = await api.get("/room/getMessages");
        console.log("🚀 ~ lastMessagesResponse:", lastMessagesResponse);

        //! room subscribe
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    })();
  }, [params.roomId]);

  return (
    <section className="py-3 container" style={{ backgroundColor: "#F5F5F5" }}>
      <div className="row container m-1">
        <div className="col-lg-4 col-md-3 col-sm-12">
          <ListGroup>
            <ListGroup.Item
              className="d-flex justify-content-between align-items-start my-1"
              action
              variant="info"
            >
              <div className="d-flex flex-row">
                <div>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar"
                    className="d-flex align-self-center me-3"
                    width="60"
                  />
                  <span className="badge bg-success badge-dot"></span>
                </div>
                <div className="pt-1">
                  <p className="fw-bold mb-0">Marie Horwitz</p>
                </div>
              </div>
              <div className="pt-1">
                <p className="small text-muted mb-1">Last seen?</p>
                <span className="badge bg-danger rounded-pill float-end">
                  Active?
                </span>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </div>
        <div
          className="col-lg-8 col-md-9 col-sm-12 p-3"
          style={{ backgroundColor: "#CDC4F9" }}
        >
          <TextMessage
            message=" messages here messages here mmessages here mmessages here mmessages here messages here messages here"
            senderName="John Doe"
            messageTime={new Date()}
          />
          <TextMessage
            message=" messages here messages here mmessages here mmessages here mmessages here messages here messages here"
            senderName="John Doe"
            messageTime={new Date()}
          />

          <hr></hr>
          <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
              alt="avatar 3"
              style={{ width: "40px", height: "100%" }}
              className="me-1"
            />
            <div className="w-100">
              <Form onSubmit={onChatFormSubmit}>
                <InputGroup className="w-100-on-lg ">
                  <Form.Control
                    type="text"
                    placeholder="Type message"
                    name="mesage"
                  />
                  <Button className="ms-1">
                    <i className="fa-solid fa-paperclip"></i>
                  </Button>
                  <Button className="ms-1">
                    <i className="fa-regular fa-face-smile"></i>
                  </Button>
                  <Button className="ms-1" type="submit">
                    <i className="fa-regular fa-paper-plane"></i>
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
