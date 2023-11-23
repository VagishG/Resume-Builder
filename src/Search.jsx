import React, { useState } from "react";
import db from "./Database";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Search(props) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([
    {
      "First Name": "",
      "Last Name": "",
      "Phone Number": "",
      "Address": "",
      "DOB": "",
      "id": "",
      "image": "",
      "resume": "",
      "Education":[]
    },
  ]);
  const [education,setE]=React.useState([])

  async function retrive() {
    if (search === "") {
      const querySnapshot = await getDocs(collection(db, "Data"));

      const newData = [];
      querySnapshot.forEach((doc) => {
        const t = doc.data();
        t.id = doc.id;
        newData.push(t);
      });
      
      setData(newData);
    } else {

      const q = query(
        collection(db, "Data"),
        where("First Name", ">=", search),
        where("First Name", "<=", search + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);

      const newData = [];
      querySnapshot.forEach((doc) => {
        const t = doc.data();
        t.id = doc.id;
        newData.push(t);
      });
      setData(newData);
    }
  }

  function handleClick(id) {
    props.setR(true);
    console.log(data)
    const clickedElement = data.find((element) => element.id === id);
    props.SetData(clickedElement);
    props.setEdu(clickedElement["Education"])
  }

  function onTextChange(event) {
    setSearch(event.target.value);
  }

  const items = data.map((element) => (
    <div className="search-result" key={element.id} onClick={() => handleClick(element.id)}>
      {element["First Name"] + " " + element["Last Name"]}
    </div>
  ));

  return (
    <div className="search-container">
      <p>For search start typing any name</p>
      <br />
      <input
        type="text"
        placeholder="Start Typing Name"
        value={search}
        onChange={onTextChange}
      />
      <button onClick={retrive}>Search</button>
      <div className="search-results">{items}</div>
    </div>
  );
}
