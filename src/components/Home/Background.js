import loginBackground from '../assest/loginBackground.jpeg'
import React from 'react'

const BackgroundImage = ({ children }) => {
  const style = {
    backgroundImage: `url(${loginBackground})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    opacity: 1.0,
  };

  return <div style={style}>{children}</div>;
};

export default BackgroundImage;