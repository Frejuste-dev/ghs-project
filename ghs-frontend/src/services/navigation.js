// Simple global navigation service for using React Router navigation outside components
// Usage: In a component inside Router, call setNavigator(useNavigate()).
// Then, anywhere (e.g., API interceptors), call navigate('/login').

let navigatorFn = null;

export function setNavigator(fn) {
  navigatorFn = fn;
}

export function navigate(path, options = {}) {
  if (typeof navigatorFn === 'function') {
    navigatorFn(path, options);
  } else {
    // Fallback if navigator not ready
    if (typeof window !== 'undefined' && path) {
      if (options.replace) {
        window.location.replace(path);
      } else {
        window.location.href = path;
      }
    }
  }
}
