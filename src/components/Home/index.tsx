"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef, useState } from "react";
import styles from "./Home.module.scss";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput } from "@fullcalendar/core";
import type { DateClickArg } from "@fullcalendar/interaction";
import { auth, provider } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  getIdToken,
  GoogleAuthProvider,
  reauthenticateWithPopup,
  setPersistence,
  browserLocalPersistence,
  User,
} from "firebase/auth";

type Holiday = { title: string; date: string; color?: string };
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
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
};

const Home = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selected, setSelected] = useState("");
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");

  const calendarRef = useRef<FullCalendar | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const storedToken = sessionStorage.getItem("google_access_token");
        if (storedToken) setToken(storedToken);
      } else {
        setUser(null);
        setToken("");
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔐 Sign out
  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setToken("");
  };

  // 📆 Swipe gesture for calendar
  useEffect(() => {
    if (!containerRef.current) return;
    let touchStartX = 0,
      touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) =>
      (touchStartX = e.changedTouches[0].screenX);
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;
      if (touchEndX < touchStartX - 50) calendarApi.next();
      else if (touchEndX > touchStartX + 50) calendarApi.prev();
    };

    containerRef.current.addEventListener("touchstart", handleTouchStart);
    containerRef.current.addEventListener("touchend", handleTouchEnd);
    return () => {
      containerRef.current?.removeEventListener("touchstart", handleTouchStart);
      containerRef.current?.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // 🇮🇳 Fetch holidays
  useEffect(() => {
    if (!selected) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/holidays/${selected}`)
      .then((res) => res.json())
      .then((data) => {
        const gazettedEvents = data.holidays.gazetted.map((h: Holiday) => ({
          title: h.title,
          date: h.date,
          color: "#1e90ff",
          className: styles.gazettedEvent,
        }));
        const restrictedEvents = data.holidays.restricted.map((h: Holiday) => ({
          title: h.title,
          date: h.date,
          color: "#ff4040",
          className: styles.restrictedEvent,
        }));
        setHolidays([...gazettedEvents, ...restrictedEvents]);
      })
      .catch(console.error);
  }, [selected]);

  // 📆 Fetch Google Calendar events
  useEffect(() => {
    if (!token) return;
    fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const mappedEvents: EventInput[] =
          data.items?.map((event: GoogleCalendarEvent) => ({
            id: event.id,
            title: event.summary,
            start: event.start.date || event.start.dateTime?.split("T")[0],
            end: event.end.date || event.end.dateTime?.split("T")[0],
            className: styles.notesClass,
            color: "#32CD32",
          })) || [];
        setCalendarEvents(mappedEvents);
      });
  }, [token]);

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.dateStr);
  };

  // 🗒️ Fetch notes from backend
  useEffect(() => {
    if (!user?.email) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes?user_id=${user.email}`)
      .then((res) => res.json())
      .then((data: Note[]) => {
        setNotes(
          data.map((note) => ({
            ...note,
            className: styles.notesClass,
            allDay: true,
          }))
        );
      });
  }, [user]);

  // ➕ Add a note
  const handleAddNote = async () => {
    if (!noteText || !selectedDate || !user?.email) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notes?user_id=${user.email}`,
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
      ...data,
      className: styles.notesClass,
      allDay: true,
    };
    setNotes((prev) => [...prev, newNote]);
    setNoteText("");
  };

  console.log("calendarEvents", calendarEvents);

  const allEvents = [...notes, ...holidays, ...calendarEvents];

  // if (!user) {
  //   return <button onClick={handleSignIn}>Sign in with Google</button>;
  // }

  return (
    <div className="App">
      <div className={styles.flex}>
        <select
          className={styles.stateDropdown}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select State</option>
          <option value="central">Central</option>
          <option value="br">Bihar</option>
          <option value="ap">Andhra Pradesh</option>
          <option value="wb">West Bengal</option>
          <option value="ar">Arunachal Pradesh</option>
          <option value="as">Assam</option>
          <option value="ch">Chhattisgarh</option>
          {/* <option value="go">Goa</option>
          <option value="gj">Gujarat</option>
          <option value="hr">Haryana</option>
          <option value="hp">Himachal Pradesh</option>
          <option value="jk">jharkhand</option>
          <option value="ka">Karnataka</option>
          <option value="ke">Kerala</option>
          <option value="mp">Madhya Pradesh</option>
          <option value="mh">Maharashtra</option>
          <option value="mn">Manipur</option>
          <option value="mg">Meghalaya</option>
          <option value="mz">Mizoram</option>
          <option value="ng">Nagaland</option>
          <option value="od">Odisha</option>
          <option value="pj">Punjab</option>
          <option value="rj">Rajasthan</option>
          <option value="sk">Sikkim</option>
          <option value="tn">Tamil Nadu</option>
          <option value="tg">Telangana</option>
          <option value="tr">Tripura</option>
          <option value="up">Uttar Pradesh</option>
          <option value="uk">Uttrakhand</option> */}
        </select>
        <button
          onClick={handleSignOut}
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
          headerToolbar={{ left: "prev", center: "title", right: "next" }}
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
