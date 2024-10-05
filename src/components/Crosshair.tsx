import React from 'react'

const Crosshair: React.FC = () => {
  const style: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '20px',
    height: '20px',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none'
  }

  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="4" />
      <circle cx="50" cy="50" r="45" fill="none" stroke="black" strokeWidth="2" />
      <line x1="50" y1="20" x2="50" y2="80" stroke="white" strokeWidth="4" />
      <line x1="50" y1="20" x2="50" y2="80" stroke="black" strokeWidth="2" />
      <line x1="20" y1="50" x2="80" y2="50" stroke="white" strokeWidth="4" />
      <line x1="20" y1="50" x2="80" y2="50" stroke="black" strokeWidth="2" />
    </svg>
  )
}

export default Crosshair