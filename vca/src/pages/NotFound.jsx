import { Link } from '../components/Link.jsx';
import { useTitle } from '../lib/hooks.js';

export default function NotFound() {
  useTitle('ไม่พบหน้านี้');
  return (
    <section className="wrap empty-page">
      <div className="empty">
        <p className="kicker">404</p>
        <h1 className="page-h">ไม่พบหน้านี้</h1>
        <p>ลิงก์อาจพิมพ์ผิด หรือหน้านี้ถูกย้ายไปแล้ว</p>
        <Link to="/" className="btn btn-ink">กลับหน้าแรก</Link>
      </div>
    </section>
  );
}
