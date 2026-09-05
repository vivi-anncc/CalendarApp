import { useState } from 'react';
import type { CalendarEvent } from './App';

type CalendarProps = {
  events: CalendarEvent[];
  onAddEvent: () => void;
  onEditEvent: (
    event: CalendarEvent,
  ) => void;
};

function Calendar({
  events,
  onAddEvent,
  onEditEvent,
}: CalendarProps) {
  const [currentDate, setCurrentDate] =
    useState(new Date());

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1,
    ).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0,
    ).getDate();

  const monthName =
    currentDate.toLocaleString(
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
    setCurrentDate(
      new Date(),
    );
  }

  function isToday(day: number) {
    return (
      day === today.getDate() &&
      month ===
        today.getMonth() &&
      year ===
        today.getFullYear()
    );
  }

  function getEventsForDay(
    day: number,
  ) {
    return events.filter(
      (event) => {
        const eventDate =
          new Date(
            event.startTime,
          );

        return (
          eventDate.getDate() ===
            day &&
          eventDate.getMonth() ===
            month &&
          eventDate.getFullYear() ===
            year
        );
      },
    );
  }

  return (
    <main className="calendar-section">

      <div className="calendar-title-row">

        <div className="calendar-title">

          <h2>
            {monthName} {year}
          </h2>

          <p>
            Keep track of your little plans.
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

      <div className="calendar-card">

        <div className="calendar-navigation">

          <button
            type="button"
            className="month-button"
            onClick={
              previousMonth
            }
            aria-label="Previous month"
          >
            ←
          </button>

          <button
            type="button"
            className="today-button"
            onClick={
              goToToday
            }
          >
            Today
          </button>

          <button
            type="button"
            className="month-button"
            onClick={
              nextMonth
            }
            aria-label="Next month"
          >
            →
          </button>

        </div>

        <div className="weekdays">

          {weekdays.map(
            (day) => (
              <div
                key={day}
                className="weekday"
              >
                {day}
              </div>
            ),
          )}

        </div>

        <div className="calendar-grid">

          {Array.from({
            length: firstDay,
          }).map(
            (_, index) => (
              <div
                key={`empty-${index}`}
                className="calendar-day empty-day"
              />
            ),
          )}

          {Array.from({
            length: daysInMonth,
          }).map(
            (_, index) => {
              const day =
                index + 1;

              const dayEvents =
                getEventsForDay(
                  day,
                );

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

                    {dayEvents.map(
                      (event) => (
                        <button
                          type="button"
                          key={event.id}
                          className="calendar-event"
                          title={
                            event.description ||
                            event.title
                          }
                          onClick={() =>
                            onEditEvent(
                              event,
                            )
                          }
                        >
                          {event.title}
                        </button>
                      ),
                    )}

                  </div>

                </div>
              );
            },
          )}

        </div>

      </div>

    </main>
  );
}

export default Calendar;
