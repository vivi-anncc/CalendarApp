import { useState } from 'react';
import type { CalendarEvent } from './App';

type CalendarProps = {
  events: CalendarEvent[];
  onAddEvent: () => void;
};

function Calendar({
  events,
  onAddEvent,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(
    new Date(),
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(
    year,
    month,
    1,
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  const monthName = currentDate.toLocaleString(
    'default',
    {
      month: 'long',
    },
  );

  const weekdays = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];

  const today = new Date();

  function previousMonth() {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1,
      ),
    );
  }

  function nextMonth() {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1,
      ),
    );
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  function isToday(day: number) {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  }

  function getEventsForDay(day: number) {
    return events.filter((event) => {
      const eventDate = new Date(
        event.startTime,
      );

      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  }

  return (
    <main className="calendar-section">

      {/* =====================================
          TITLE ROW
          ===================================== */}

      <div className="calendar-title-row">

        <div className="calendar-title">
          <h2>
            {monthName} {year}
          </h2>

          <p>
            Your plans, all in one place.
          </p>
        </div>

        <button
          type="button"
          className="add-event-button"
          onClick={onAddEvent}
        >
          <span className="add-icon">
            ＋
          </span>

          Add Event
        </button>

      </div>


      {/* =====================================
          CALENDAR CARD
          ===================================== */}

      <div className="calendar-card">

        {/* NAVIGATION */}

        <div className="calendar-navigation">

          <button
            type="button"
            className="month-button"
            onClick={previousMonth}
          >
            ←
          </button>

          <button
            type="button"
            className="today-button"
            onClick={goToToday}
          >
            Today
          </button>

          <button
            type="button"
            className="month-button"
            onClick={nextMonth}
          >
            →
          </button>

        </div>


        {/* WEEKDAYS */}

        <div className="weekdays">

          {weekdays.map((day) => (
            <div
              key={day}
              className="weekday"
            >
              {day}
            </div>
          ))}

        </div>


        {/* CALENDAR DAYS */}

        <div className="calendar-grid">

          {Array.from({
            length: firstDay,
          }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="calendar-day empty-day"
            />
          ))}


          {Array.from({
            length: daysInMonth,
          }).map((_, index) => {

            const day = index + 1;

            const dayEvents =
              getEventsForDay(day);

            return (
              <div
                key={day}
                className={`calendar-day ${
                  isToday(day)
                    ? 'today'
                    : ''
                }`}
              >

                <div className="day-number">
                  {day}
                </div>

                <div className="day-events">

                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="calendar-event"
                      title={
                        event.description ||
                        event.title
                      }
                    >
                      {event.title}
                    </div>
                  ))}

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </main>
  );
}

export default Calendar;
