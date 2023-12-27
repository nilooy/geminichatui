import s from "./loading-dots.module.css";

const LoadingDots = ({ className = "bg-gray-400", rootClass }) => {
  return (
    <span className={`${s.root} ${rootClass}`}>
      <span className={className} />
      <span className={className} />
      <span className={className} />
    </span>
  );
};

export default LoadingDots;
