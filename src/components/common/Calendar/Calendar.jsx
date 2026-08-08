import React, { useState } from "react";
import "./Calendar.css";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar({
  events = [],
  view = "month", // 'month' | 'week' | 'day'
  onViewChange,
  currentDate = new Date(),
  onDateChange,
  onEventClick,
  onCellClick,
  loading = false,
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => {
    const nextDate = new Date(currentDate);
    if (view === "month") {
      nextDate.setMonth(month - 1);
    } else if (view === "week") {
      nextDate.setDate(currentDate.getDate() - 7);
    } else {
      nextDate.setDate(currentDate.getDate() - 1);
    }
    onDateChange(nextDate);
  };

  const handleNext = () => {
    const nextDate = new Date(currentDate);
    if (view === "month") {
      nextDate.setMonth(month + 1);
    } else if (view === "week") {
      nextDate.setDate(currentDate.getDate() + 7);
    } else {
      nextDate.setDate(currentDate.getDate() + 1);
    }
    onDateChange(nextDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  // Format header title
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const headerTitle =
    view === "month"
      ? `${monthNames[month]} ${year}`
      : view === "week"
      ? `Week of ${monthNames[month]} ${currentDate.getDate()}, ${year}`
      : `${monthNames[month]} ${currentDate.getDate()}, ${year}`;

  // Days generator for Month View
  const getDaysInMonth = () => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dateObj = new Date(year, month - 1, prevMonthDays - i);
      days.push({ date: dateObj, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const dateObj = new Date(year, month, i);
      days.push({ date: dateObj, isCurrentMonth: true });
    }

    // Next month padding to complete 35 or 42 grid cells
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const dateObj = new Date(year, month + 1, i);
      days.push({ date: dateObj, isCurrentMonth: false });
    }

    return days;
  };

  const daysGrid = getDaysInMonth();

  // Helper to match events for a given day
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((ev) => {
      if (!ev.startDate) return false;
      const startStr = new Date(ev.startDate).toISOString().split("T")[0];
      const endStr = ev.endDate
        ? new Date(ev.endDate).toISOString().split("T")[0]
        : startStr;
      return dateStr >= startStr && dateStr <= endStr;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="lms-calendar-container">
      {/* CALENDAR HEADER & CONTROLS */}
      <div className="calendar-header-bar">
        <div className="calendar-nav-controls">
          <button
            type="button"
            className="calendar-today-btn"
            onClick={handleToday}
          >
            Today
          </button>
          <div className="calendar-arrows">
            <button type="button" className="calendar-nav-btn" onClick={handlePrev}>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button type="button" className="calendar-nav-btn" onClick={handleNext}>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <h2 className="calendar-month-title">{headerTitle}</h2>
        </div>

        {onViewChange && (
          <div className="calendar-view-switcher">
            <button
              type="button"
              className={`view-btn ${view === "month" ? "active" : ""}`}
              onClick={() => onViewChange("month")}
            >
              Month
            </button>
            <button
              type="button"
              className={`view-btn ${view === "week" ? "active" : ""}`}
              onClick={() => onViewChange("week")}
            >
              Week
            </button>
            <button
              type="button"
              className={`view-btn ${view === "day" ? "active" : ""}`}
              onClick={() => onViewChange("day")}
            >
              Day
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="calendar-loading-overlay">
          <div className="calendar-spinner"></div>
          <span>Loading Calendar Events...</span>
        </div>
      )}

      {/* MONTH VIEW */}
      {view === "month" && (
        <div className="calendar-grid-month">
          <div className="calendar-weekdays-row">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="calendar-weekday-cell">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days-grid">
            {daysGrid.map((dayObj, index) => {
              const dayEvents = getEventsForDate(dayObj.date);
              const todayClass = isToday(dayObj.date) ? "cell-today" : "";
              const monthClass = dayObj.isCurrentMonth ? "" : "cell-other-month";
              const weekendClass = isWeekend(dayObj.date) ? "cell-weekend" : "";

              return (
                <div
                  key={index}
                  className={`calendar-day-cell ${todayClass} ${monthClass} ${weekendClass}`}
                  onClick={() => onCellClick && onCellClick(dayObj.date)}
                >
                  <div className="day-cell-header">
                    <span className="day-number">{dayObj.date.getDate()}</span>
                    {dayEvents.length > 0 && (
                      <span className="day-event-count">
                        {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
                      </span>
                    )}
                  </div>

                  <div className="day-cell-events">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <div
                        key={ev._id || ev.id || Math.random()}
                        className={`event-badge category-${ev.category || "event"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEventClick) onEventClick(ev);
                        }}
                        title={`${ev.title} (${ev.category})`}
                      >
                        <span className="event-badge-dot"></span>
                        <span className="event-badge-title">{ev.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="event-more-tag">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {view === "week" && (
        <div className="calendar-week-view">
          <div className="calendar-weekdays-row">
            {Array.from({ length: 7 }).map((_, i) => {
              const dayDate = new Date(currentDate);
              const dayOfWeek = dayDate.getDay();
              dayDate.setDate(dayDate.getDate() - dayOfWeek + i);
              const dayEvents = getEventsForDate(dayDate);

              return (
                <div
                  key={i}
                  className={`week-day-column ${isToday(dayDate) ? "cell-today" : ""}`}
                  onClick={() => onCellClick && onCellClick(dayDate)}
                >
                  <div className="week-day-header">
                    <span className="week-day-name">{DAYS_OF_WEEK[i]}</span>
                    <span className="week-day-number">{dayDate.getDate()}</span>
                  </div>
                  <div className="week-day-events">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev._id || ev.id}
                        className={`event-badge category-${ev.category || "event"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEventClick) onEventClick(ev);
                        }}
                      >
                        <span className="event-badge-title">{ev.title}</span>
                        <span className="event-category-pill">{ev.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAY VIEW */}
      {view === "day" && (
        <div className="calendar-day-view">
          <div className="day-view-header">
            <h3>{DAYS_OF_WEEK[currentDate.getDay()]}, {headerTitle}</h3>
            {isWeekend(currentDate) && <span className="weekend-badge">Weekend</span>}
          </div>

          <div className="day-view-events-list">
            {getEventsForDate(currentDate).length === 0 ? (
              <div className="no-events-day">No events scheduled for this date.</div>
            ) : (
              getEventsForDate(currentDate).map((ev) => (
                <div
                  key={ev._id || ev.id}
                  className={`day-event-card category-${ev.category || "event"}`}
                  onClick={() => onEventClick && onEventClick(ev)}
                >
                  <div className="day-event-top">
                    <span className={`category-tag tag-${ev.category}`}>{ev.category}</span>
                    {ev.priority && (
                      <span className={`priority-tag priority-${ev.priority}`}>
                        {ev.priority}
                      </span>
                    )}
                  </div>
                  <h4 className="day-event-title">{ev.title}</h4>
                  <p className="day-event-desc">{ev.description || "No description provided."}</p>
                  <div className="day-event-footer">
                    <span>Target: {ev.target}</span>
                    {ev.repeatEveryYear && <span>(Repeats Yearly)</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
