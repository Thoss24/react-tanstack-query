import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, updateEvent, queryClient } from '../utility/http.js';

export default function EditEvent() {

  const param = useParams();
  const id = param.id;

  const {data : eventData} = useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({id, signal})
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const eventData = data.event // access event property from mutate function in handleSubmit
      queryClient.cancelQueries({queryKey: ['events', id]}); // cancel outgoing query re-fetches - most useful for optimistic updating
      const previousEvent = await queryClient.getQueryData(['events', id]); // get current query data - before query data was updated
      queryClient.setQueryData(['events', id], eventData) // update query data

      return {
        previousEvent
      }
    }, 
    onError: ({error, data, context}) => {
      queryClient.setQueryData(['events', id], context.previousEvent)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['events', id])
    }
  });

  const navigate = useNavigate();

  function handleSubmit(formData) {
    console.log(formData)
    mutate({id: id, event: formData})
  };

  function handleClose() {
    navigate('../');
  };

  return (
    <Modal onClose={handleClose}>
      <EventForm inputData={eventData} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    </Modal>
  );
}
