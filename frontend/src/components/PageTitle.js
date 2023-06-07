export default function PageTitle({ children, className }) {
  return (
    <h1
      className={`${className} flex justify-center text-blue-700
    underline decoration-blue-700 underline-offset-4 font-bold
    text-3xl`}
    >
      {children}
    </h1>
  );
}
