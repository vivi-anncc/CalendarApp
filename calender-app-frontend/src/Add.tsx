import { useState } from 'react';
import type { CalendarEvent } from './App';

type AddProps = {
  onEventCreated: (
    newEvent: CalendarEvent,
  ) => void;

  onCancel: () => void;
};

function Add({
  onEventCreated,
  onCancel,
}: AddProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');
  const [startTime, setStartTime] =
    useState('');
  const [endTime, setEndTime] =
    useState('');
  const [location, setLocation] =
    useState('');

  const [message, setMessage] =
    useState('');
  const [saving, setSaving] =
    useState(false);

  async function createEvent() {
    const token =
      localStorage.getItem(
        'accessToken',
      );

    if (!token) {
      setMessage(
        'Please login first.',
      );
      return;
    }

    // Only these three fields are mandatory.
    if (
      !title.trim() ||
      !startTime ||
      !endTime
    ) {
      setMessage(
        'Please fill in all required fields.',
      );
      return;
    }

    // Make sure the end is after the start.
    if (
      new Date(endTime) <=
      new Date(startTime)
    ) {
      setMessage(
        'End time must be after the start time.',
      );
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(
        'http://localhost:3000/events',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: title.trim(),
            description:
              description.trim() || undefined,
            startTime,
            endTime,
            location:
              location.trim() || undefined,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message ||
                'Could not create event.',
        );

        return;
      }

      onEventCreated(data);
    } catch {
      setMessage(
        'Could not connect to the server.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="add-page">

      {/* ================================
          BACK BUTTON
          ================================ */}

      <button
        type="button"
        className="back-button"
        onClick={onCancel}
      >
        ← Back to Calendar
      </button>


      {/* ================================
          HEADER
          ================================ */}

      <div className="add-header">

        <div>
          <h1>
            Create an Event ✨
          </h1>

          <p>
            Add something lovely to your calendar.
          </p>
        </div>

      </div>


      {/* ================================
          FORM CARD
          ================================ */}

      <div className="add-card">

        {/* TITLE */}

        <div className="field">

          <label>
            Title <span className="required">*</span>
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="What are you planning?"
          />

        </div>


        {/* DESCRIPTION — OPTIONAL */}

        <div className="field">

          <label>
            Description
            <span className="optional">
              Optional
            </span>
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value,
              )
            }
            placeholder="Add a little note..."
          />

        </div>


        {/* START + END */}

        <div className="add-grid">

          <div className="field">

            <label>
              Start{' '}
              <span className="required">
                *
              </span>
            </label>

            <input
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

            <label>
              End{' '}
              <span className="required">
                *
              </span>
            </label>

            <input
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


        {/* LOCATION — OPTIONAL */}

        <div className="field">

          <label>
            Location
            <span className="optional">
              Optional
            </span>
          </label>

          <input
            type="text"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value,
              )
            }
            placeholder="Where is it?"
          />

        </div>


        {/* MESSAGE */}

        {message && (
          <p className="form-message">
            {message}
          </p>
        )}


        {/* BUTTONS */}

        <div className="add-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>


          <button
            type="button"
            className="primary-button"
            onClick={createEvent}
            disabled={saving}
          >
            {saving
              ? 'Creating...'
              : 'Create Event ✨'}
          </button>

        </div>

      </div>

    </main>
  );
}

export default Add;
