import { Link } from "react-router-dom";
import RoomBox from "../../components/room-box";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function HomePage() {
  const roomState = useSelector((state: RootState) => state.roomState);
  console.log("🚀 ~ HomePage ~ roomState:", roomState);

  return (
    <>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Chatteria</h1>
            <p className="lead text-muted">
              "Welcome to our lively community! Dive into engaging
              conversations, share stories, and explore new ideas. Get ready to
              connect and spark exciting discussions!"
            </p>
            <p>
              <Link to="/room/createRoom" className="btn btn-primary mx-2">
                Create Room
              </Link>
              <a href="#" className="btn btn-secondary mx-2">
                Secondary action
              </a>
            </p>
          </div>
        </div>
      </section>
      <div className="album py-5 bg-light">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {roomState.lastRoomInitialized
              ? roomState.lastRooms.map((item, index) => {
                  console.log("last room item -->", item);
                  return <RoomBox room={item} key={index} />;
                })
              : null}
          </div>
        </div>
      </div>
    </>
  );
}
