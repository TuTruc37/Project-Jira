import React from 'react';
import Lottie from 'lottie-react';
import AnimationLogin from '../../assets/animation/AnimationLogin.json';
import FormLogin from '../../components/Form/FormLogin/FormLogin';
import style from './register.module.scss';
const Login = () => {
  return (
    <div className={`grid h-screen bg-white ${style.gridAll}`}>
      {/* animation  */}
      <div className={`${style.displayNone}  ${style.centerLottieR}`}>
        <Lottie
          animationData={AnimationLogin}
          loop={true}
          className="h-full "
        />
      </div>
      {/* form  */}
      <div className={`${style.centerForm}`}>
        <FormLogin />
      </div>
    </div>
  );
};

export default Login;
