import React from "react";
import Header from "../components/Header";
import ProfileBody from "../components/ProfileBody";
import SearchArea from "../components/SearchArea";
import Sidebar from "../components/Sidebar";

function Search() {
  return (
    <div className="App">
      <Sidebar />
      <SearchArea />
    </div>
  );
}

export default Search;
