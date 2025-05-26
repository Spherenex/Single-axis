import { useState } from 'react'
import Vibration from '../src/components/vibration'
import './App.css'
import LineFallDetectionDashboard from './components/Linefall'
import SingleAxis from './components/SingleAxis'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Vibration/> */}
      {/* <LineFallDetectionDashboard /> */}
      <SingleAxis/>
    </>
  )
}

export default App
