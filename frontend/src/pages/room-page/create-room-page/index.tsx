import { Button, Form } from "react-bootstrap";

export default function CreateRoomPage() {
  return (
    <section className="py-5 text-center container">
      <div className="row pt-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="fw-light">You can create a Chatteria Room here!</h1>
          <p className="lead text-body-secondary">
            Rules: Just respect to all!
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-8 mx-auto">
          <Form>
            <Form.Group className="mb-3" controlId="room.name">
              <Form.Label>Room Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Please provide a room name!"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="room.visibility">
              <Form.Label>Visibility:</Form.Label>
              <br />
              <Form.Check
                inline
                label="Public"
                name="visibility"
                type="radio"
                value={"public"}
                id={`visibilityPublic`}
              />
              <Form.Check
                inline
                label="Private"
                name="visibility"
                type="radio"
                value={"private"}
                id={`visibilityPrivate`}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="room.name">
              <Button variant="outline-success">Send</Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </section>
  );
}
