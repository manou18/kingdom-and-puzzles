// netlify/functions/_lib/validate.js
//
// Shared ID-shape validators, ported unchanged from the original
// server.js so every function checks these the same way.
function isValidPlayerId(id) {
    return typeof id === 'string' && /^(pi_|guest_)[A-Za-z0-9_.-]{1,80}$/.test(id);
}
function isValidPaymentId(id) {
    return typeof id === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(id);
}
function isValidListingId(id) {
    return typeof id === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(id);
}

module.exports = { isValidPlayerId, isValidPaymentId, isValidListingId };
