const attempts = new Map();

function recordFailedLogin(email) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const timestamps = attempts.get(email) || [];

  const recent = timestamps.filter(ts => now - ts < windowMs);
  recent.push(now);

  attempts.set(email, recent);
  return recent.length;
}

function clearAttempts(email) {
  attempts.delete(email);
}

module.exports = {
  recordFailedLogin,
  clearAttempts
};