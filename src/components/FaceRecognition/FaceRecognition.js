import React from 'react'

const FaceRecognition = ({ imageUrl }) => {
  return (
    <div className='center'>
      <img src={imageUrl} alt='' width='850px' height='450px' />
    </div>
  )
}

export default FaceRecognition;