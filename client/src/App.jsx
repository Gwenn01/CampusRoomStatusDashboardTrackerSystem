import React, { useEffect, useState } from "react";
import Layout from "./shared/Layout";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <ToastContainer />
      <Layout />
    </>
  );
};

export default App;
