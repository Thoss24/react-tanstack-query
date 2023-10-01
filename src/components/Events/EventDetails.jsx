import { Link, Outlet } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchEvent, deleteEvent } from "../utility/http.js";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { queryClient } from "../utility/http.js";

import Header from "../Header.jsx";

export default function EventDetails() {
  const param = useParams();
  const id = param.id;

  const navigate = useNavigate();

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["events", {id: id}],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const { mutate } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events']
      })
      navigate('/events')
    }
  });

  const deleteEventHandler = () => {
    mutate({ id: id})
  };

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isLoading && <p>Loading...</p>}
      {data && (
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              <button onClick={deleteEventHandler}>Delete</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt="" />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>{data.date}</time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      )}
      {isError && (
        <ErrorBlock
          title={"Could not load event details"}
          message={
            error.info?.message ||
            "Failed to load event details, please try again later"
          }
        />
      )}
    </>
  );
}
