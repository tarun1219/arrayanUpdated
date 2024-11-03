import React from 'react';

const ImageAnimation = () => {
  return (
    <>
    <div className="animation-container">
      <img
        src={require('../../assets/img/base.png')}
        alt="Base Image"
        className="base-image"
      />

      <img
        src={require('../../assets/img/tr.png')}
        alt="Relative Image"
        className={`relative-image truck`}
      />
            <img
        src={require('../../assets/img/truck2.png')}
        alt="Relative Image"
        className={`relative-image truck2`}
      />
      
      <img
        src={require('../../assets/img/fruits.png')}
        alt="Relative Image"
        className={`relative-image fruits`}
      />
          <img
        src={require('../../assets/img/resilientlogo.png')}
        className={`relative-image resilientlogo`}
      />
    <div className="animation-crop-container">
      <img src={require('../../assets/img/crop1.png')} className="animated-image" />
      <img src={require('../../assets/img/crop2.png')} className="animated-image" />
    </div>
    <img
        src={require('../../assets/img/factory.png')}
        className={`relative-image factory`}
      />
          <img
        src={require('../../assets/img/cart.png')}
        className={`relative-image cart`}
      />
          <img
        src={require('../../assets/img/diary.png')}
        className={`relative-image diary`}
      />
                <img
        src={require('../../assets/img/peels-seeds.png')}
        className={`relative-image peels-seeds`}
      />
    </div>

    </>
  );
};

export default ImageAnimation;