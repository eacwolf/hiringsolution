export default function Loader({ message }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "18px", marginBottom: "12px" }}>
        ⏳
      </div>
      <p>{message}</p>
    </div>
  );
}
