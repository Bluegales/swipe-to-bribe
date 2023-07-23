import React, { useState, useMemo, useRef } from 'react'
import TinderCard from 'react-tinder-card'

const db = [
  {
    promise: 'Some Things are gonna need to be done',
    name: 'Patrick Fuchs',
    party: '42 Heilbronn',
    url: './img/dinesh.jpg'
  },
  {
    promise: 'Some Things are gonna need to be done',
    name: 'Angela Merkel',
    party: 'CDU',
    url: './img/richard.jpg'
  },
  {
    promise: 'Some Things are gonna need to be done',
    name: 'Emmanuel Macron',
    party: 'Renaissance',
    url: './img/erlich.jpg'
  },
  {
    promise: 'yessss',
    name: 'Joe Biden',
    party: 'Democratic Party',
    url: './img/monica.jpg'
  },
  {
    promise: 'Some Things are gonna need to be done',
    name: 'Marine Le Pen',
    party: 'National Rally',
    url: './img/jared.jpg'
  }
]

function Cards () {
  const [currentIndex, setCurrentIndex] = useState(db.length - 1)
  const [lastDirection, setLastDirection] = useState()
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    if (direction === "left" || direction === "skipped")
      setLastDirection("skipped");
    else
      setLastDirection("bribed");
    updateCurrentIndex(index - 1)
  }

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
    }
  }


  return (
    <div classNames="middleblock">
      <link
        href='https://fonts.googleapis.com/css?family=Damion&display=swap'
        rel='stylesheet'
      />
      <link
        href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
        rel='stylesheet'
      />
      <link 
        href='//cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack.css'
        rel='stylesheet' 
      />
      <div className="space"></div>
      <div className='cardContainer'>
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div
              style={{ backgroundImage: 'url(' + character.url + ')' }}
              className='card'
            >
              <p>{character.promise}</p>
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className='buttons'>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>Skip</button>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')}>Bribe</button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className='infoText'>
          You {lastDirection}!
        </h2>
      ) : (
        <div className='twoInfo'>
          <h3 className='infoText'>
            Swipe left - Skip
          </h3>
          <h3 className='infoText'>
            Bribe - Swipe right
          </h3>
        </div>
      )}
    </div>
  )
}

export default Cards