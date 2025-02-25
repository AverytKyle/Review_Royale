import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
  // Set default method to 'GET'
  options.method = options.method || "GET";
  options.headers = options.headers || {};

  // If the request method is not 'GET', ensure Content-Type is set
  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
    options.headers["XSRF-Token"] = Cookies.get("XSRF-TOKEN");
    // ^^ Added XSRF-TOKEN to headers after running into
    // authorization problems while working with Kyle
  }

  const res = await fetch(url, options);

  if (res.status >= 400) throw res;
  return res;
}

export function restoreCSRF() {
  return csrfFetch("/api/csrf/restore");
}
