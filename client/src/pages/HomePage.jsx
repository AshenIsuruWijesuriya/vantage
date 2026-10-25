import { Link } from 'react-router-dom';

const HomePage = () => (
  <section className="hero">
    <div className="wrap">
      <div>
        <p className="eyebrow">FW26 · Drop 02 · Out now</p>
        <h1>Earn your<br /><span className="out">Vantage</span></h1>
      </div>
      <div>
        <p>Performance and lifestyle wear cut for Colombo heat. Train hard, recover easy, wear it out after.</p>
        <div className="ctas">
          <Link className="btn solid" to="/collections/men">Shop Men</Link>
          <Link className="btn ghost" to="/collections/women">Shop Women</Link>
        </div>
      </div>
    </div>
  </section>
);

export default HomePage;