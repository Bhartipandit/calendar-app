"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import interactionPlugin from "@fullcalendar/interaction";
import { useSession, signIn, signOut } from "next-auth/react";
import type { EventInput } from "@fullcalendar/core";
import type { DateClickArg } from "@fullcalendar/interaction";

type Holiday = {
  title: string;
  date: string;
  color?: string;
};

const Home = () => {
  // const events: EventInput[] = [
  //   { title: 'Meeting', date: '2025-09-05' },
  //   { title: 'Conference', date: '2025-09-07' }
  // ]

  const [holidays, setHolidays] = useState<
    { title: string; date: string; color: string }[]
  >([]);
  const [selected, setSelected] = useState("");
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(""); // 👈 for currently clicked date
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notes");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const { data: session } = useSession();

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/holidays/${selected}`)
      .then((res) => res.json())
      .then((data) => {
        const gazettedEvents = data.holidays.gazetted.map((h: Holiday) => ({
          title: h.title,
          date: h.date,
          color: "#1e90ff",
          className: `${styles.gazettedEvent}`,
        }));

        const restrictedEvents = data.holidays.restricted.map((h: Holiday) => ({
          title: h.title,
          date: h.date,
          color: "#ff4040",
          className: `${styles.restrictedEvent}`,
        }));

        setHolidays([...gazettedEvents, ...restrictedEvents]);
      })
      .catch((err) => console.error(err));
  }, [selected]);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchEvents = async () => {
      const res = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const data = await res.json();

      const mappedEvents: EventInput[] =
        data.items?.map((event: any) => ({
          id: event.id,
          title: event.summary,
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date,
        })) || [];

      setCalendarEvents(mappedEvents);
    };

    fetchEvents();
  }, [session]);

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.dateStr);
  };

  const handleAddNote = () => {
    if (!noteText || !selectedDate) return;
    const newNote = {
      title: noteText,
      date: selectedDate,
      color: "#32CD32", // green
      className: styles.notesClass,
    };
    setNotes([...notes, newNote]);
    setNoteText(""); // reset textbox
  };

  //   useEffect(() => {
  //   const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  //   setNotes(savedNotes);
  // }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const allEvents = [...notes, ...holidays, ...calendarEvents];

  if (!session) {
    return (
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    );
  }

  return (
    <div className="App">
      <div className={styles.flex}>
        <select
          className={styles.stateDropdown}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select State</option>
          <option value="br">Bihar</option>
          <option value="ap">Andhra Pradesh</option>
          <option value="wb">West Bengal</option>
        </select>
        <button
          onClick={() => signOut()}
          style={{
            backgroundColor: "#e63946",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            height: "36px",
          }}
        >
          Sign out
        </button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={allEvents}
        height="auto"
        windowResize={(arg) => {
          if (window.innerWidth < 768) {
            arg.view.calendar.changeView("timeGridDay"); // 👈 mobile = daily view
          } else {
            arg.view.calendar.changeView("dayGridMonth");
          }
        }}
        dateClick={handleDateClick}
      />
      <legend className={styles.legend}>🔵 Gazetted | 🔴 Restricted</legend>

      <div className={styles.noteBox}>
        <input
          type="text"
          placeholder={`Add note or event for ${selectedDate}`}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className={styles.noteInput}
        />
        <button onClick={handleAddNote} disabled={!selectedDate}>
          Add
        </button>
      </div>
    </div>
  );
};

export default Home;
