// netlify/functions/_lib/jsonResponse.js
//
// Every function in this app returns JSON, but most of them were building
// the response by hand as { statusCode, body: JSON.stringify(...) } with
// no headers object at all. Netlify Functions default an unlabeled
// response to Content-Type: text/plain — so despite every one of these
// endpoints (approve, complete, start-game, save-progress, submit-score,
// etc.) actually sending JSON, they were showing up mislabeled as
// text/plain in Netlify's analytics, and skipping whatever
// compression/handling Netlify applies based on a recognized JSON
// content-type. This wrapper is the single place that sets the header
// correctly, so every call site just does `return jsonResponse(200, data)`
// instead of repeating (and risking forgetting) the headers object.
function jsonResponse(statusCode, data) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
}

module.exports = { jsonResponse };
