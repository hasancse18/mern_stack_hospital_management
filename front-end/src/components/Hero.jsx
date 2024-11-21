import React from 'react'

const Hero = ({title, imageUrl}) => {
  return (
    <div className='hero container'>
      <div className='banner'>
        <h1>{title}</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
        Soluta quia nobis commodi hic nostrum voluptatibus.</p>

      </div>
      <div className="banner">
        <img src={imageUrl} alt="animated-image" />
        <span>
          <img src="/Vector.png" alt="vector" />
        </span>

      </div>
      
    </div>
  )
}

export default Hero
