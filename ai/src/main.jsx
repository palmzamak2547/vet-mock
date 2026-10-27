import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';

// Google Translate rewrites text nodes React owns, and React then throws
// NotFoundError on removeChild/insertBefore. Readers of a Thai site do run it.
const { removeChild, insertBefore } = Node.prototype;
Node.prototype.removeChild = function (child) {
  if (child.parentNode !== this) return child;
  return removeChild.call(this, child);
};
Node.prototype.insertBefore = function (node, ref) {
  if (ref && ref.parentNode !== this) return node;
  return insertBefore.call(this, node, ref);
};

createRoot(document.getElementById('root')).render(<App />);
