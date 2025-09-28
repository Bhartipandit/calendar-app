"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef, useState } from "react";
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

type Note = {
  id?: string;
  title: string;
  date: string;
  color: string;
  className?: string;
  allDay?: boolean;
};

type GoogleCalendarEvent = {
  id: string;
  summary: string;
  start: {
    date?: string; // all-day events
    dateTime?: string; // timed events
  };
  end: {
    date?: string;
    dateTime?: string;
  };
  className?: string;
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
  const [notes, setNotes] = useState<Note[]>([]);
  const { data: session } = useSession();

  const calendarRef = useRef<FullCalendar | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    };

    const handleGesture = () => {
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;

      if (touchEndX < touchStartX - 50) {
        calendarApi.next();
      } else if (touchEndX > touchStartX + 50) {
        calendarApi.prev();
      }
    };

    const div = containerRef.current;
    div.addEventListener("touchstart", handleTouchStart);
    div.addEventListener("touchend", handleTouchEnd);

    return () => {
      div.removeEventListener("touchstart", handleTouchStart);
      div.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/holidays/${selected}`)
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
        data.items?.map((event: GoogleCalendarEvent) => ({
          id: event.id,
          title: event.summary,
          start: event.start.date || event?.start?.dateTime?.split("T")[0], // get only date part
          end: event.end.date || event.end.dateTime?.split("T")[0],
          className: `${styles.notesClass}`,
          color: "#32CD32",
        })) || [];

      setCalendarEvents(mappedEvents);
    };

    fetchEvents();
  }, [session]);

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.dateStr);
  };

  useEffect(() => {
    if (!session) return;

    const fetchNotes = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notes?user_id=${session?.user?.email}`,
        {
          cache: "no-store",
        }
      );
      const data: Note[] = await res.json();
      setNotes(
        data.map((note: Note) => ({
          ...note,
          className: styles.notesClass,
          allDay: true,
        }))
      );
    };

    fetchNotes();
  }, [session]);

  const handleAddNote = async () => {
    if (!noteText || !selectedDate) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notes?user_id=${session?.user?.email}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noteText,
          date: selectedDate,
          color: "#32CD32",
        }),
      }
    );

    const data = await res.json();

    const newNote: Note = {
      id: data.id,
      title: data.title,
      date: data.date,
      color: data.color,
      className: styles.notesClass,
      allDay: true,
    };

    setNotes((prev) => [...prev, newNote]);
    setNoteText("");
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
      <div ref={containerRef}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}
          events={allEvents}
          height="auto"
          dateClick={handleDateClick}
        />
      </div>
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
