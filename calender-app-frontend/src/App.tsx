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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [message, setMessage] = useState('');

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
        localStorage.removeItem('accessToken');

        setIsLoggedIn(false);
        setEvents([]);

        setMessage(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message,
        );

        return;
      }

      setEvents(data);
    } catch {
      setMessage('Could not load your events.');
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
            'Content-Type': 'application/json',
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
            : data.message,
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

      await loadEvents(data.access_token);
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
    setMessage('Event created! ✨');
  }

  function logout() {
    localStorage.removeItem('accessToken');

    setIsLoggedIn(false);
    setShowAdd(false);
    setEvents([]);

    setUsername('');
    setPassword('');
    setMessage('');
  }

  useEffect(() => {
    const token =
      localStorage.getItem('accessToken');

    if (token) {
      setIsLoggedIn(true);
      loadEvents(token);
    }
  }, []);

  /*
   * =========================================
   * LOGIN PAGE
   * =========================================
   */

  if (!isLoggedIn) {
    return (
      <div className="app">

        <div className="login-page">

          <div className="login-content">

            <div className="brand">

              {/* LOGO */}

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

            </div>

            {/* LOGIN FORM */}

            <div className="login-form">

              <div className="field">

                <label>
                  Username
                </label>

                <input
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Enter username"
                />

              </div>

              <div className="field">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      login();
                    }
                  }}
                />

              </div>

              <button
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
   * =========================================
   * ADD EVENT PAGE
   * =========================================
   */

  if (showAdd) {
    return (
      <div className="app">

        <div className="page">

          <Add
            onEventCreated={handleEventCreated}
            onCancel={() => {
              setShowAdd(false);
              setMessage('');
            }}
          />

        </div>

      </div>
    );
  }

  /*
   * =========================================
   * CALENDAR PAGE
   * =========================================
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
