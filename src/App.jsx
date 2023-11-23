import { useState } from 'react'
import Rest from"./Rest"
import  "./index.css"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>  
      <h1 >Welcome to the resume app</h1>
      {/* <br />
      <br /> */}
      <Rest/>
    </>
  )
}

export default App
