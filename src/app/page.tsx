import Image from "next/image";
import styles from "./page.module.css";
import RevampedContainer from "@/redux/common/layouts/revampedContainer";
import HomePage from "@/redux/features/homescreen/container/Home";

export default function Home() {
  return (
    <RevampedContainer>
      <HomePage/>
    </RevampedContainer>
  );
}
