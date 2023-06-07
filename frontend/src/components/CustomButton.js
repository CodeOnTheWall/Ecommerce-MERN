export default function CustomButton({ children, onClick, className }) {
  return (
    <button onClick={onClick} className={`${className} btn`}>
      {children}
    </button>
  );
}
