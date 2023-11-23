import React from "react";

export default function TextField(props){
    const [text,setText]=React.useState([])

    function handdleAdd(){
        props.setText((prevTextFields) => [...prevTextFields, ""]);
        console.log(props.text)
    }

    function handleDeleteTextField(index){
        props.setText((prevTextFields) => {
            const updatedTextFields = [...prevTextFields];
            updatedTextFields.splice(index, 1);
            return updatedTextFields;
          });
    }
    const fields=props.text.map((t, index) => (
        <div key={index}>
          <input
            type="text"
            value={t}
            onChange={(e) => {
              props.setText((prevTextFields) => {
                const updatedTextFields = [...prevTextFields];
                updatedTextFields[index] = e.target.value;
                return updatedTextFields;
              });
            }}
          />
          <button onClick={() => handleDeleteTextField(index)}>-</button>
        </div>
      ))
      return (
        <div>
            {fields}
            <button onClick={handdleAdd}>+</button>
        </div>
      )
}
