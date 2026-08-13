import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import Calendar from "../../components/common/Calendar/Calendar";
import FilterBar from "../../components/common/FilterBar/FilterBar";
import StatCard from "../../components/common/StatCard/StatCard";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import EventModal from "./EventModal";
import { useAuth } from "../../hooks/UseAuth";
import {
  getAcademicCalendarEvents,
  getWorkingDaysSummary,
  getUpcomingEvents,
  createAcademicEvent,
  updateAcademicEvent,
  deleteAcademicEvent,
  restoreAcademicEvent,
} from "../../services/academicCalendarService";
import { getClassList } from "../../services/ClassService";
import { getDivisionList } from "../../services/DivisionService";

import "./AcademicCalendar.css";

function AcademicCalendar() {
  const { user } = useAuth();
  const isPrincipal = user?.role === "principal";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [category, setCategory] = useState("");
  const [target, setTarget] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  // Summary & Panel state
  const [workingDays, setWorkingDays] = useState({
    workingDays: 0,
    holidays: 0,
    weekends: 0,
    totalDays: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);

  // Modal & Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch dropdown data
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [clsRes, divRes] = await Promise.all([
          getClassList().catch(() => ({ data: [] })),
          getDivisionList().catch(() => ({ data: [] })),
        ]);
        setClasses(clsRes.data || clsRes || []);
        setDivisions(divRes.data || divRes || []);
      } catch (err) {
        console.error("Error loading classes/divisions:", err);
      }
    };
    fetchMetadata();
  }, []);

  // Main data fetching
  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        academicYear,
        ...(category && { category }),
        ...(target && { target }),
        ...(selectedClass && { classId: selectedClass }),
        ...(selectedDivision && { divisionId: selectedDivision }),
        status: statusFilter,
        limit: 100,
      };

      const [eventsRes, summaryRes, upcomingRes] = await Promise.all([
        getAcademicCalendarEvents(params).catch(() => ({ items: [] })),
        getWorkingDaysSummary(academicYear).catch(() => ({ data: {} })),
        getUpcomingEvents(5).catch(() => ({ data: [] })),
      ]);

      const eventList = eventsRes.items || eventsRes.data?.items || eventsRes.data?.events || eventsRes.data || [];
      setEvents(eventList);

      const summary = summaryRes.data || summaryRes;
      if (summary) {
        setWorkingDays({
          workingDays: summary.workingDays ?? summary.totalWorkingDays ?? 0,
          holidays: summary.holidays ?? summary.totalHolidays ?? 0,
          weekends: summary.weekends ?? 0,
          totalDays: summary.totalDays ?? 0,
        });
      }

      const upList = upcomingRes.data || upcomingRes.items || upcomingRes || [];
      setUpcomingEvents(Array.isArray(upList) ? upList : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load academic calendar");
    } finally {
      setLoading(false);
    }
  }, [academicYear, category, target, selectedClass, selectedDivision, statusFilter]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  // Handlers
  const handleOpenCreateModal = () => {
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCellClick = (date) => {
    if (!isPrincipal) return;
    setSelectedEvent({
      startDate: date.toISOString().split("T")[0],
      endDate: date.toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  const handleSaveEvent = async (formData) => {
    setActionLoading(true);
    try {
      // Clean payload for backend target scope rules
      const payload = { ...formData };
      if (payload.target === "school") {
        delete payload.classId;
        delete payload.divisionId;
      } else if (payload.target === "class") {
        delete payload.divisionId;
        if (!payload.classId) delete payload.classId;
      } else if (payload.target === "division") {
        if (!payload.classId) delete payload.classId;
        if (!payload.divisionId) delete payload.divisionId;
      }

      if (selectedEvent && selectedEvent._id) {
        await updateAcademicEvent(selectedEvent._id, payload);
        toast.success("Event updated successfully!");
      } else {
        await createAcademicEvent(payload);
        toast.success("Event created successfully!");
      }
      setModalOpen(false);
      fetchCalendarData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save event");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTrigger = (id) => {
    setDeletingId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setActionLoading(true);
    try {
      await deleteAcademicEvent(deletingId);
      toast.success("Event deleted (moved to inactive)");
      setConfirmDeleteOpen(false);
      setModalOpen(false);
      fetchCalendarData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete event");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async (id) => {
    setActionLoading(true);
    try {
      await restoreAcademicEvent(id);
      toast.success("Event restored successfully!");
      setModalOpen(false);
      fetchCalendarData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to restore event");
    } finally {
      setActionLoading(false);
    }
  };

  const activeFilterCount =
    (category ? 1 : 0) +
    (target ? 1 : 0) +
    (selectedClass ? 1 : 0) +
    (selectedDivision ? 1 : 0) +
    (statusFilter !== "active" ? 1 : 0);

  const handleResetFilters = () => {
    setCategory("");
    setTarget("");
    setSelectedClass("");
    setSelectedDivision("");
    setStatusFilter("active");
  };

  return (
    <div className="academic-calendar-page">
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Academic Calendar</h1>
          <p className="page-subtitle">
            Manage holidays, exams, vacations, meetings, and school events.
          </p>
        </div>

        {isPrincipal && (
          <button
            type="button"
            className="btn-create-event"
            onClick={handleOpenCreateModal}
          >
            <span className="material-symbols-outlined">add</span>
            Create Event
          </button>
        )}
      </div>

      {/* WORKING DAYS SUMMARY STAT CARDS */}
      <div className="summary-cards-grid">
        <StatCard
          title="Working Days"
          value={workingDays.workingDays}
          subtitle={`Academic Year ${academicYear}`}
          icon="calendar_month"
          iconBg="var(--primary-light)"
          iconColor="var(--primary)"
        />
        <StatCard
          title="Holidays & Vacations"
          value={workingDays.holidays}
          subtitle="Scheduled Time Off"
          icon="beach_access"
          iconBg="var(--warning-light)"
          iconColor="var(--warning)"
        />
        <StatCard
          title="Weekend Days"
          value={workingDays.weekends}
          subtitle="Non-academic days"
          icon="event_repeat"
          iconBg="rgba(139, 92, 246, 0.15)"
          iconColor="#8b5cf6"
        />
      </div>

      {/* FILTER BAR */}
      <FilterBar activeCount={activeFilterCount} onReset={handleResetFilters}>
        <select
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
        >
          <option value="2025-2026">2025-2026</option>
          <option value="2024-2025">2024-2025</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="holiday">Holiday</option>
          <option value="vacation">Vacation</option>
          <option value="exam">Exam</option>
          <option value="event">Event</option>
          <option value="meeting">Meeting</option>
        </select>

        <select value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="">All Target Scopes</option>
          <option value="school">School Wide</option>
          <option value="class">Class Specific</option>
          <option value="division">Division Specific</option>
        </select>

        {target === "class" && (
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        )}

        {target === "division" && (
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
          >
            <option value="">All Divisions</option>
            {divisions.map((div) => (
              <option key={div._id} value={div._id}>
                {div.name}
              </option>
            ))}
          </select>
        )}

        {isPrincipal && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="active">Active Events</option>
            <option value="inactive">Deleted / Inactive</option>
          </select>
        )}
      </FilterBar>

      {/* MAIN LAYOUT: CALENDAR + UPCOMING EVENTS SIDEBAR */}
      <div className="calendar-main-layout">
        <div className="calendar-view-container">
          {events.length === 0 && !loading ? (
            <EmptyState
              icon="event_busy"
              title="No events found"
              description="No calendar events match your current filters. Create a new event or adjust search filters."
              actionLabel={isPrincipal ? "Create Event" : null}
              onAction={isPrincipal ? handleOpenCreateModal : null}
            />
          ) : (
            <Calendar
              events={events}
              view={view}
              onViewChange={setView}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onEventClick={handleEventClick}
              onCellClick={handleCellClick}
              loading={loading}
            />
          )}
        </div>

        {/* UPCOMING EVENTS SIDE PANEL */}
        <aside className="upcoming-events-sidebar">
          <div className="panel-header">
            <span className="material-symbols-outlined panel-icon">
              event_upcoming
            </span>
            <h3>Upcoming Events</h3>
          </div>

          <div className="upcoming-events-list">
            {upcomingEvents.length === 0 ? (
              <p className="no-upcoming">No events scheduled in the near future.</p>
            ) : (
              upcomingEvents.map((ev) => (
                <div
                  key={ev._id}
                  className={`upcoming-card category-${ev.category || "event"}`}
                  onClick={() => handleEventClick(ev)}
                >
                  <div className="upcoming-date-box">
                    <span className="up-day">
                      {new Date(ev.startDate).getDate()}
                    </span>
                    <span className="up-month">
                      {new Date(ev.startDate).toLocaleString("default", {
                        month: "short",
                      })}
                    </span>
                  </div>

                  <div className="upcoming-info">
                    <h4 className="up-title">{ev.title}</h4>
                    <span className="up-category">{ev.category}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* EVENT MODAL */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveEvent}
        onDelete={handleDeleteTrigger}
        onRestore={handleRestore}
        event={selectedEvent}
        classes={classes}
        divisions={divisions}
        loading={actionLoading}
      />

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? (It will be marked as inactive and can be restored later)."
        confirmText="Delete Event"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
}

export default AcademicCalendar;
