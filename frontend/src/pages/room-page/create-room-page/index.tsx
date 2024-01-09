import { Button, Form } from "react-bootstrap";
import "./style.css";
import { formJson } from "../../../utils/functions";
import { RootState, appDispatch } from "../../../redux/store";
import {
  CreateRoomDataType,
  RoomStateType,
  creatRoomService,
} from "../../../redux/slices/room-slice";
import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRoomPage() {
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = formJson<CreateRoomDataType>(event.currentTarget);

    const result = await creatRoomService(value);
    console.log("🚀 ~ onSubmit ~ result:", result);

    if (result) {
      navigate("/room/" + result._id);
    }
  };

  const roomState = useSelector<RootState, RoomStateType>(
    (state) => state.roomState
  );
  console.log("🚀 ~ CreateRoomPage ~ roomState:", roomState);
  const [show, setShow] = useState(true);

  return (
    <section className="p-5 text-center container my-3">
      <div className="row pt-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="fw-light">Create a Chatteria!</h1>
          <p className="lead text-muted">Rules: We respect each other!</p>
        </div>
      </div>
      {roomState.errorMessage ? (
        <Alert variant="danger" dismissible onClose={() => setShow(false)}>
          <Alert.Heading className="text-center">
            You got an error!
          </Alert.Heading>
          <p>{roomState.errorMessage}</p>
        </Alert>
      ) : null}
      <div className="row">
        <div className="col-lg-6 col-md-8 mx-auto">
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="room.name">
              <Form.Label className="fw-bold">Room Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter a room name"
                className="form-control-animate"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="room.visibility">
              <Form.Label className="fw-bold mb-3 d-block">
                Visibility:
              </Form.Label>
              <div className="d-flex justify-content-center">
                <Form.Check
                  label="Public"
                  name="visibility"
                  type="radio"
                  value="public"
                  id="visibilityPublic"
                  className="form-check-animate mx-3"
                />
                <Form.Check
                  label="Private"
                  name="visibility"
                  type="radio"
                  value="private"
                  id="visibilityPrivate"
                  className="form-check-animate mx-3"
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="room.maxClient">
              <Form.Label className="fw-bold">Maximum Participants:</Form.Label>
              <Form.Control
                type="number"
                name="maxClient"
                defaultValue={0}
                className="form-control-animate"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="room.name">
              <Button
                type="submit"
                variant="outline-success"
                className="w-100 rounded-pill btn-animate"
                disabled={!!roomState.errorMessage}
              >
                Create Room
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </section>
  );
}
