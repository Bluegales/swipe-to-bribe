import './App.css'
import Cards from './/Cards'
import LeftSide from './Left'
import RightSide from './Right'


function App () {
  return (
    <div className='app'>
      <LeftSide />
      <Cards />
      <RightSide />
    </div>
  )
}

export default App
