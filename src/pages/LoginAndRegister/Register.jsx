import React from 'react';
import Lottie from 'lottie-react';
import AnimationRegister from '../../assets/animation/AnimationRegister.json';
import FormRegister from '../../components/Form/FormRegister/FormRegister';
import style from './register.module.scss';
const Register = () => {
  return (
    <div className={`grid h-screen bg-white ${style.gridAll} `}>
      {/* animation  */}
      <div className={`${style.displayNone}`}>
        <Lottie
          animationData={AnimationRegister}
          loop={true}
          className="h-full"
        />
      </div>
      {/* form  */}
      <div className={`${style.centerForm}`}>
        <FormRegister />
      </div>
    </div>
  );
};

export default Register;
