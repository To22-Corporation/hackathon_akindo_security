import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { SubmitHandler } from "react-hook-form";
import IndexTemplate from "../templates";

const Home: NextPage = () => {
  const onSubmit = () => {
    // バックエンドへpost
  };
  return <IndexTemplate onSubmit={onSubmit} />;
};

export default Home;
