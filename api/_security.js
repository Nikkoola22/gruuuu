const STATIC_ALLOWED_ORIGINS = new Set([
  'https://new-unifed.vercel.app',
  'https://nikkoola22.github.io',
]);

const LOCAL_ALLOWED_ORIGIN_REGEX = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const ALLOWED_ROLES = new Set(['system', 'user', 'assistant']);
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_MODEL_LENGTH = 64;

const getRequestOriginCandidates = (req) => {
  if (!req || !req.headers) {
    return [];
  }

  const forwardedHost = req.headers['x-forwarded-host'];
  const host = forwardedHost || req.headers.host;

  if (!host) {
    return [];
  }

  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = typeof forwardedProto === 'string' && forwardedProto.length > 0
    ? forwardedProto.split(',')[0].trim()
    : 'https';

  return [`${protocol}://${host}`];
};

const getEnvAllowedOrigins = () => {
  const extraOrigins = process.env.ALLOWED_ORIGINS;

  if (!extraOrigins) {
    return [];
  }

  return extraOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const isAllowedOrigin = (origin, req) => {
  if (!origin) {
    return true;
  }

  return LOCAL_ALLOWED_ORIGIN_REGEX.test(origin)
    || getRequestOriginCandidates(req).includes(origin)
    || STATIC_ALLOWED_ORIGINS.has(origin)
    || getEnvAllowedOrigins().includes(origin);
};

export const handleCors = (req, res, methods) => {
  const requestOrigin = req.headers.origin;

  if (requestOrigin) {
    if (!isAllowedOrigin(requestOrigin, req)) {
      res.status(403).json({ error: 'Origin not allowed' });
      return false;
    }

    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', methods.join(','));
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return false;
  }

  return true;
};

export const sanitizeCompletionRequest = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return null;
  }

  const model = typeof body.model === 'string'
    && /^[a-zA-Z0-9._:-]+$/.test(body.model)
    && body.model.length <= MAX_MODEL_LENGTH
      ? body.model
      : 'sonar';

  const messages = Array.isArray(body.messages)
    ? body.messages
        .slice(0, MAX_MESSAGES)
        .map((message) => {
          if (!message || typeof message !== 'object' || Array.isArray(message)) {
            return null;
          }

          const role = typeof message.role === 'string' && ALLOWED_ROLES.has(message.role)
            ? message.role
            : null;
          const content = typeof message.content === 'string'
            ? message.content.trim().slice(0, MAX_MESSAGE_LENGTH)
            : '';

          if (!role || !content) {
            return null;
          }

          return { role, content };
        })
        .filter(Boolean)
    : [];

  if (messages.length === 0) {
    return null;
  }

  return {
    model,
    messages,
    stream: false,
  };
};

export const summarizeCompletionRequest = (body) => ({
  model: body.model,
  messageCount: body.messages.length,
  roles: body.messages.map((message) => message.role),
  totalChars: body.messages.reduce((total, message) => total + message.content.length, 0),
});