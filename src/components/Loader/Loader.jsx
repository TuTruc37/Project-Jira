import loadingAnimation from '../../assets/animation/loadingAnimation.json';
import Lottie from 'lottie-react';

export default function Loader() {
  return (
    <div
      className="h-screen w-full flex items-center justify-center fixed top-0 left-40 bg-gray-200 bg-opacity-30"
      style={{ zIndex: '99999' }}
    >
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
}
