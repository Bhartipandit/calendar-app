"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { useEffect, useState } from "react";
import styles from "./Home.module.scss";

const Home = () => {
  // const events: EventInput[] = [
  //   { title: 'Meeting', date: '2025-09-05' },
  //   { title: 'Conference', date: '2025-09-07' }
  // ]

  const [holidays, setHolidays] = useState<{ title: string; date: string }[]>(
    []
  );
  const [selected,setSelected] = useState('')

  useEffect(() => {
    fetch(`/api/holidays/${selected}`)
      .then((res) => res.json())
      .then((data) => setHolidays(data.holidays || []))
      .catch((err) => console.error(err));
  }, [selected]);
  console.log("events", holidays);

  return (
    <div className="App">
      <select className={styles.stateDropdown} onChange={(e)=>setSelected(e.target.value)}>
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
      />
    </div>
  );
};

export default Home;
