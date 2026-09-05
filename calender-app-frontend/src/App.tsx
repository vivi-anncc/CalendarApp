import { useEffect, useState } from 'react';
import './App.css';

import Calendar from './Calendar';
import Add from './Add';

export type CalendarEvent = {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
};

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [showAdd, setShowAdd] =
    useState(false);

  const [editingEvent, setEditingEvent] =
    useState<CalendarEvent | null>(null);

  const [message, setMessage] =
    useState('');

  async function loadEvents(token: string) {
    try {
      const response = await fetch(
        'http://localhost:3000/events',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        localStorage.removeItem(
          'accessToken',
        );

        setIsLoggedIn(false);
        setEvents([]);

        setMessage(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message ||
                'Could not load events.',
        );

        return;
      }

      setEvents(data);
    } catch {
      setMessage(
        'Could not load your events.',
      );
    }
  }

  async function login() {
    if (!username || !password) {
      setMessage(
        'Please enter your username and password.',
      );

      return;
    }

    try {
      const response = await fetch(
        'http://localhost:3000/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message ||
                'Login failed.',
        );

        return;
      }

      localStorage.setItem(
        'accessToken',
        data.access_token,
      );

      setIsLoggedIn(true);
      setPassword('');
      setMessage('');

      await loadEvents(
        data.access_token,
      );
    } catch {
      setMessage(
        'Could not connect to the server.',
      );
    }
  }

  function handleEventCreated(
    newEvent: CalendarEvent,
  ) {
    setEvents((currentEvents) => [
      ...currentEvents,
      newEvent,
    ]);

    setShowAdd(false);
    setEditingEvent(null);

    setMessage(
      'Event created! ✨',
    );
  }

  async function handleEventUpdated(
    updatedEvent: CalendarEvent,
  ) {
    const token =
      localStorage.getItem(
        'accessToken',
      );

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/events/${updatedEvent.id}`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json',

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: updatedEvent.title,
            description:
              updatedEvent.description,
            startTime:
              updatedEvent.startTime,
            endTime:
              updatedEvent.endTime,
            location:
              updatedEvent.location,
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
                'Could not update the event.',
        );

        return;
      }

      setEvents((currentEvents) =>
        currentEvents.map((event) =>
          event.id === updatedEvent.id
            ? data
            : event,
        ),
      );

      setEditingEvent(null);

      setMessage(
        'Event updated! ✨',
      );
    } catch {
      setMessage(
        'Could not connect to the server.',
      );
    }
  }

  async function handleEventDeleted(
    eventId: number,
  ) {
    const token =
      localStorage.getItem(
        'accessToken',
      );

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this event?',
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/events/${eventId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        let data: {
          message?: string | string[];
        } | null = null;

        try {
          data =
            await response.json();
        } catch {
          data = null;
        }

        setMessage(
          Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message ||
                'Could not delete the event.',
        );

        return;
      }

      setEvents((currentEvents) =>
        currentEvents.filter(
          (event) =>
            event.id !== eventId,
        ),
      );

      setEditingEvent(null);

      setMessage(
        'Event deleted! ✨',
      );
    } catch {
      setMessage(
        'Could not connect to the server.',
      );
    }
  }

  function handleEditEvent(
    event: CalendarEvent,
  ) {
    setMessage('');
    setShowAdd(false);
    setEditingEvent(event);
  }

  function handleCancelEdit() {
    setEditingEvent(null);
    setMessage('');
  }

  function handleCancelAdd() {
    setShowAdd(false);
    setMessage('');
  }

  function logout() {
    localStorage.removeItem(
      'accessToken',
    );

    setIsLoggedIn(false);
    setShowAdd(false);
    setEditingEvent(null);
    setEvents([]);

    setUsername('');
    setPassword('');
    setMessage('');
  }

  useEffect(() => {
    const token =
      localStorage.getItem(
        'accessToken',
      );

    if (token) {
      setIsLoggedIn(true);
      loadEvents(token);
    }
  }, []);

  /*
   * ================================
   * LOGIN
   * ================================
   */

  if (!isLoggedIn) {
    return (
      <div className="app">
        <div className="login-page">

          <div className="login-content">

            <div className="brand">

              <div className="logo-wrapper">

                <div className="logo-bubbles">

                  <span className="bubble bubble-1" />
                  <span className="bubble bubble-2" />
                  <span className="bubble bubble-3" />
                  <span className="bubble bubble-4" />
                  <span className="bubble bubble-5" />
                  <span className="bubble bubble-6" />
                  <span className="bubble bubble-7" />
                  <span className="bubble bubble-8" />

                  <span className="sparkle sparkle-1">
                    ✦
                  </span>

                  <span className="sparkle sparkle-2">
                    ✧
                  </span>

                  <span className="sparkle sparkle-3">
                    ✦
                  </span>

                  <span className="sparkle sparkle-4">
                    ✧
                  </span>

                  <span className="sparkle sparkle-5">
                    ·
                  </span>

                </div>

                <h1 className="brand-name">
                  Lunelle
                </h1>

              </div>

              <p className="brand-tagline">
                Your little space for planning.
              </p>

            </div>

            <div className="login-form">

              <div className="field">

                <label htmlFor="username">
                  Username
                </label>

                <input
                  id="username"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value,
                    )
                  }
                  placeholder="Enter username"
                />

              </div>

              <div className="field">

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value,
                    )
                  }
                  placeholder="Enter password"
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter'
                    ) {
                      login();
                    }
                  }}
                />

              </div>

              <button
                type="button"
                className="primary-button"
                onClick={login}
              >
                Login
              </button>

            </div>

            {message && (
              <p className="message">
                {message}
              </p>
            )}

          </div>

        </div>
      </div>
    );
  }

  /*
   * ================================
   * ADD EVENT
   * ================================
   */

  if (showAdd) {
    return (
      <div className="app">

        <div className="page">

          <Add
            onEventCreated={
              handleEventCreated
            }
            onCancel={
              handleCancelAdd
            }
          />

        </div>

      </div>
    );
  }

  /*
   * ================================
   * EDIT EVENT
   * ================================
   */

  if (editingEvent) {
    return (
      <div className="app">

        <div className="page">

          <Add
            event={editingEvent}
            onEventCreated={
              handleEventUpdated
            }
            onCancel={
              handleCancelEdit
            }
            onDelete={
              handleEventDeleted
            }
          />

        </div>

      </div>
    );
  }

  /*
   * ================================
   * CALENDAR
   * ================================
   */

  return (
    <div className="app">

      <div className="page">

        <header className="topbar">

          <div className="topbar-brand">

            <h1>
              Lunelle
            </h1>

            <p>
              Your little calendar ✦
            </p>

          </div>

          <button
            type="button"
            className="logout"
            onClick={logout}
          >
            Logout
          </button>

        </header>

        <Calendar
          events={events}
          onAddEvent={() => {
            setMessage('');
            setShowAdd(true);
          }}
          onEditEvent={
            handleEditEvent
          }
        />

        {message && (
          <p className="message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default App;
