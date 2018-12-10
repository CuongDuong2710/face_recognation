import React from 'react'

const Navigation = ({ onRouteChange }) => {
  return ( // .f3 { font-size: 1.5rem; }; dim: hover
    <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
      <p 
        className='f3 link dim black underline pa3 pointer'
        onClick={() => onRouteChange('signin')}
      >
        Sign Out
      </p>
    </nav>
  )
}

export default Navigation;