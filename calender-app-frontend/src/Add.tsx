import {
  useEffect,
  useState,
} from 'react';

import type {
  CalendarEvent,
} from './App';

type AddProps = {
  event?: CalendarEvent;

  onEventCreated: (
    event: CalendarEvent,
  ) => void;

  onCancel: () => void;

  onDelete?: (
    eventId: number,
  ) => void;
};

function formatDateTimeLocal(
  value: string,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    date.getDate(),
  ).padStart(2, '0');

  const hours = String(
    date.getHours(),
  ).padStart(2, '0');

  const minutes = String(
    date.getMinutes(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function Add({
  event,
  onEventCreated,
  onCancel,
  onDelete,
}: AddProps) {
  const isEditing =
    Boolean(event);

  const [title, setTitle] =
    useState(
      event?.title || '',
    );

  const [description, setDescription] =
    useState(
      event?.description || '',
    );

  const [startTime, setStartTime] =
    useState(
      event
        ? formatDateTimeLocal(
            event.startTime,
          )
        : '',
    );

  const [endTime, setEndTime] =
    useState(
      event
        ? formatDateTimeLocal(
            event.endTime,
          )
        : '',
    );

  const [location, setLocation] =
    useState(
      event?.location || '',
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    setTitle(
      event?.title || '',
    );

    setDescription(
      event?.description || '',
    );

    setStartTime(
      event
        ? formatDateTimeLocal(
            event.startTime,
          )
        : '',
    );

    setEndTime(
      event
        ? formatDateTimeLocal(
            event.endTime,
          )
        : '',
    );

    setLocation(
      event?.location || '',
    );

    setError('');
  }, [event]);

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    setError('');

    // Title is required
    if (!title.trim()) {
      setError(
        'Please enter an event title.',
      );

      return;
    }

    // Start time is required
    if (!startTime) {
      setError(
        'Please choose a start time.',
      );

      return;
    }

    // End time is required
    if (!endTime) {
      setError(
        'Please choose an end time.',
      );

      return;
    }

    const start =
      new Date(startTime);

    const end =
      new Date(endTime);

    if (end <= start) {
      setError(
        'End time must be after the start time.',
      );

      return;
    }

    const token =
      localStorage.getItem(
        'accessToken',
      );

    if (!token) {
      setError(
        'You are not logged in.',
      );

      return;
    }

    setSaving(true);

    try {
      if (isEditing && event) {
        const response =
          await fetch(
            `http://localhost:3000/events/${event.id}`,
            {
              method: 'PATCH',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                title: title.trim(),

                description:
                  description.trim() ||
                  undefined,

                startTime:
                  new Date(
                    startTime,
                  ).toISOString(),

                endTime:
                  new Date(
                    endTime,
                  ).toISOString(),

                location:
                  location.trim() ||
                  undefined,
              }),
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            Array.isArray(
              data.message,
            )
              ? data.message.join(
                  ', ',
                )
              : data.message ||
                  'Could not update the event.',
          );

          return;
        }

        onEventCreated(data);

        return;
      }

      const response =
        await fetch(
          'http://localhost:3000/events',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              title: title.trim(),

              description:
                description.trim() ||
                undefined,

              startTime:
                new Date(
                  startTime,
                ).toISOString(),

              endTime:
                new Date(
                  endTime,
                ).toISOString(),

              location:
                location.trim() ||
                undefined,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          Array.isArray(
            data.message,
          )
            ? data.message.join(
                ', ',
              )
            : data.message ||
                'Could not create the event.',
        );

        return;
      }

      onEventCreated(data);
    } catch {
      setError(
        'Could not connect to the server.',
      );
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (
      !event ||
      !onDelete
    ) {
      return;
    }

    onDelete(event.id);
  }

  return (
    <div className="add-page">

      <div className="add-card">

        <button
          type="button"
          className="close-button"
          onClick={onCancel}
          aria-label="Cancel"
        >
          ×
        </button>

        <div className="add-header">

          <h2>
            {isEditing
              ? 'Edit Event'
              : 'Add Event'}
          </h2>

          <p>
            {isEditing
              ? 'Update your event details.'
              : 'Add something lovely to your calendar.'}
          </p>

        </div>

        <form
          className="add-form"
          onSubmit={
            handleSubmit
          }
        >

          {/* TITLE - REQUIRED */}

          <div className="field">

            <label htmlFor="event-title">
              Title
              <span className="required">
                *
              </span>
            </label>

            <input
              id="event-title"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value,
                )
              }
              placeholder="Event title"
            />

          </div>


          {/* DESCRIPTION - OPTIONAL */}

          <div className="field">

            <label htmlFor="event-description">
              Description
            </label>

            <textarea
              id="event-description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
              placeholder="Add a little description..."
            />

          </div>


          {/* START AND END - REQUIRED */}

          <div className="time-row">

            <div className="field">

              <label htmlFor="event-start">
                Start
                <span className="required">
                  *
                </span>
              </label>

              <input
                id="event-start"
                type="datetime-local"
                value={startTime}
                onChange={(e) =>
                  setStartTime(
                    e.target.value,
                  )
                }
              />

            </div>

            <div className="field">

              <label htmlFor="event-end">
                End
                <span className="required">
                  *
                </span>
              </label>

              <input
                id="event-end"
                type="datetime-local"
                value={endTime}
                onChange={(e) =>
                  setEndTime(
                    e.target.value,
                  )
                }
              />

            </div>

          </div>


          {/* LOCATION - OPTIONAL */}

          <div className="field">

            <label htmlFor="event-location">
              Location
            </label>

            <input
              id="event-location"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value,
                )
              }
              placeholder="Optional location"
            />

          </div>


          {/* ERROR */}

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}


          {/* BUTTONS */}

          <div className="form-actions">

            {isEditing &&
              onDelete && (
                <button
                  type="button"
                  className="delete-button"
                  onClick={
                    handleDelete
                  }
                  disabled={saving}
                >
                  Delete Event
                </button>
              )}

            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Save Event'}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Add;
