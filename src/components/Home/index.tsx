"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { useEffect, useState } from "react";
import styles from "./Home.module.scss";

type Holiday = {
  title: string;
  date: string;
};

const Home = () => {
  // const events: EventInput[] = [
  //   { title: 'Meeting', date: '2025-09-05' },
  //   { title: 'Conference', date: '2025-09-07' }
  // ]

  const [holidays, setHolidays] = useState<{ title: string; date: string }[]>(
    []
  );
  const [selected, setSelected] = useState("");

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

  return (
    <div className="App">
      <select
        className={styles.stateDropdown}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Select State</option>
        <option value="br">Bihar</option>
        <option value="ap">Andhra Pradesh</option>
        <option value="wb">West Bengal</option>
      </select>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={holidays}
        height="auto"
        windowResize={(arg) => {
          if (window.innerWidth < 768) {
            arg.view.calendar.changeView("timeGridDay"); // 👈 mobile = daily view
          } else {
            arg.view.calendar.changeView("dayGridMonth");
          }
        }}
      />
      <legend className={styles.legend}>🔵 Gazetted | 🔴 Restricted</legend>
    </div>
  );
};

export default Home;
