import { Link } from 'react-router-dom';

const ComingSoon = ({ title }) => (
  <section className="wrap page-message">
    <h1>{title}</h1>
    <p>This page is being built.</p>
    <Link className="btn ink" to="/">Back to home</Link>
  </section>
);

export default ComingSoon;