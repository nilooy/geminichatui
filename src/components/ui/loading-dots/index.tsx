import s from "./loading-dots.module.css";

const LoadingDots = ({ className = "bg-gray-400" }) => {
  return (
    <span className={`${s.root}`}>
      <span className={className} />
      <span className={className} />
      <span className={className} />
    </span>
  );
};

export default LoadingDots;
