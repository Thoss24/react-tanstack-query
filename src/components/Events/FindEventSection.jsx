import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import fetchEvents from "../utility/fetch-events";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";

export default function FindEventSection() {
  const [searchTerm, setSearchTerm] = useState();
  const searchElement = useRef();

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["events", { search: searchTerm }],
    queryFn: ({signal}) => fetchEvents({signal, searchTerm}),
    enabled: searchTerm !== undefined
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  };

  let content;

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  };

  if (isLoading) {
    content = <LoadingIndicator />;
  };

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info.message || "Failed to load events"}
      />
    );
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
