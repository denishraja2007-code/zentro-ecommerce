import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
      <p>Sorry, indha page illa.</p>
      <Link to="/">Home ku pogalam</Link>
    </div>
  );
}