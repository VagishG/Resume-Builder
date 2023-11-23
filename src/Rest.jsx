import React from "react";
import Files from "./Files";
import TextField from "./TextField";
import db from "./Database";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocs,
  doc,
  where,
  setDoc,
  query
} from "firebase/firestore";

import Search from './Search'
import { ref, uploadBytes, getStorage, deleteObject, getDownloadURL } from "firebase/storage";

export default function Rest() {
  const CollectionRef = collection(db, "Data");
  const storageRef = getStorage();
  const [Ret, SetRet] = React.useState(false);
  const [resume, SetResume] = React.useState(null);
  const [photo, SetPhoto] = React.useState(null);
  const [text, setText] = React.useState([]);
  const [data, setData] = React.useState({
    "First Name": "",
    "Last Name": "",
    "Phone Number": "",
    "Address": "",
    "Date Of Birth": "",
    "id": "",
    "image": "",
    "resume": "",
  });

  async function deleteImage(){
    if(data["image"]===""){
      window.alert("No Image found")
      // window.location.reload()
      // return;
    }
    else{

      const desertRefImage = ref(storageRef, data["image"]);
      
      deleteObject(desertRefImage).catch((error) => console.log(error));
      const docRef = doc(db, "Data", data["id"]);
      await updateDoc(docRef,{"image":""});
      alert("Done")
      window.location.reload()
    }
  }
  async function deleteResume(){
    if(data["resume"]===""){
      window.alert("No Resume found")
      // window.location.reload()
      // return;
    }
    else{
      const desertRefImage = ref(storageRef, data["resume"]);
    
      deleteObject(desertRefImage).catch((error) => console.log(error));
      const docRef = doc(db, "Data", data["id"]);
      await updateDoc(docRef,{"resume":""});
      alert("Done")
      window.location.reload()
    }
  }
  
  async function deleteData() {
    deleteImage()
    deleteResume()
    await deleteDoc(doc(db, "Data", data["id"]));
    window.location.reload()
  }

  async function changeData() {
    try {
      const docRef = doc(db, "Data", data["id"]);
  
      if (photo != null) {
        const desertRefImage = ref(storageRef, data["image"]);
        await deleteObject(desertRefImage);
        
        const filesFolderRefphoto = ref(storageRef, `images/${"photo" + data["First Name"] + data["Last Name"]}`);
        await uploadBytes(filesFolderRefphoto, photo);
  
        const imageUrl = await getDownloadURL(filesFolderRefphoto);
  
        await updateDoc(docRef, { "image": imageUrl });
        console.log('File image successfully updated!');
      }
  
      if (resume != null) {
        const desertRefResume = ref(storageRef, data["resume"]);
        await deleteObject(desertRefResume);
        
        const filesFolderRefresume = ref(storageRef, `images/${"resume" + data["First Name"] + data["Last Name"]}`);
        await uploadBytes(filesFolderRefresume, resume);
  
        const resumeUrl = await getDownloadURL(filesFolderRefresume);
  
        await updateDoc(docRef, { "resume": resumeUrl });
        console.log('File resume successfully updated!');
      }
  
      alert("Data was done updating");
      window.location.reload()
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating data");
      window.location.reload()
    }
  }
  

  // function getUrl(path) {
  //   getDownloadURL(ref(storageRef, path))
  //     .then((url) => {
  //       const xhr = new XMLHttpRequest();
  //       xhr.responseType = 'blob';
  //       xhr.onload = (event) => {
  //         const blob = xhr.response;
  //       };
  //       xhr.open('GET', url);
  //       xhr.send();

  //       const img = document.getElementById('myimg');
  //       img.setAttribute('src', url);
  //       return url;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  async function SubmitData() {
    if (!resume && !photo) return;
    const filesFolderRefresume = ref(storageRef, `images/${"resume" + data["First Name"] + data["Last Name"]}`);
    const filesFolderRefphoto = ref(storageRef, `images/${"photo" + data["First Name"] + data["Last Name"]}`);
    
    try {
      await uploadBytes(filesFolderRefresume, resume);
      await uploadBytes(filesFolderRefphoto, photo);
      console.log('File uploaded successfully!');
    } catch (err) {
      console.error(err);
    }

    console.log("Image done");
    console.log(data);

    try {
      const docRef = await addDoc(CollectionRef, {
        "Education": text,
        "First Name": data["First Name"],
        "Last Name": data["Last Name"],
        "Phone Number": data["Phone Number"],
        "Date Of Birth": data["Date Of Birth"],
        "Address": data["Address"],
        "image": `https://firebasestorage.googleapis.com/v0/b/reactproject-4f0fd.appspot.com/o/images%2F${"photo" + data["First Name"] + data["Last Name"]}?alt=media`,
        "resume": `https://firebasestorage.googleapis.com/v0/b/reactproject-4f0fd.appspot.com/o/images%2F${"resume" + data["First Name"] + data["Last Name"]}?alt=media`
      });

      const id = docRef.id;
      setData(prev => ({
        ...prev,
        ["id"]: id
      }));
    } catch (err) {
      console.log(err);
    }

    alert("Data was updated");
    window.location.reload()
  }

  function onTextChange(event) {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  console.log
  return (
    <div className="rest">
      <Search setR={SetRet} SetData={setData} setEdu={setText}/>
      <input
        type="text"
        onChange={onTextChange}
        name="First Name"
        placeholder="First Name"
        value={data["First Name"]}
      />
      <input
        type="text"
        onChange={onTextChange}
        name="Last Name"
        placeholder="Last Name"
        value={data["Last Name"]}
      />
      <input
        type="text"
        onChange={onTextChange}
        name="Phone Number"
        placeholder="Phone Number"
        value={data["Phone Number"]}
      />
      <input
        type="text"
        onChange={onTextChange}
        name="Address"
        placeholder="Address"
        value={data["Address"]}
      />

      <input
        type="date"
        onChange={onTextChange}
        name="Date Of Birth"
        placeholder="Date Of Birth"
        value={data["Date Of Birth"]}
      />
      <TextField text={text} setText={setText} />

      {Ret ? 
        <div className="retrive">
          {data["image"]===""?<p>No photo Found</p>:
          <div>
          <button onClick={deleteImage}>Delete Image</button>
          <img src={data["image"]} alt="Img"/>
            </div>}
          
          <Files selectedImage={photo} setSelectedImage={SetPhoto} call={["image/jpeg",'image/png']} accept={".jpg, .jpeg, .png, .gif"}/>    
          {data["resume"]===""?<p>No resume Found</p>:
          <div>


          <button onClick={deleteResume}>Delete Resume</button>
            <a href={data["resume"]}>Download Resume From Here</a>
          </div>}
          
          <Files selectedImage={resume} setSelectedImage={SetResume} call={["application/pdf"]} accept={".pdf"}/>
        </div>
        : 
        <div className="files">
          <Files selectedImage={photo} setSelectedImage={SetPhoto} call={["image/jpeg",'image/png']} accept={".jpg, .jpeg, .png, .gif"}/>    
          <Files selectedImage={resume} setSelectedImage={SetResume} call={["application/pdf"]} accept={".pdf"}/>
        </div>
      }

      <button type="button" onClick={SubmitData}>Upload Data</button>

      {Ret && 
      <>
      <button onClick={changeData}>Change Data</button>
      <button onClick={deleteData}>delete</button>

      </>}
      </div>
  );
}
