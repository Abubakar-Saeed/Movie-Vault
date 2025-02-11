export default function ErrorMessage({ err }) {
  return (
    <p className="error">
      <span>❌</span>
      {err}
    </p>
  );
}
