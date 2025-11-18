export const config = {
  cors: {
    allowOrigin: '*',
    allowHeaders: 'Content-Type,Authorization',
    allowMethods: 'GET,POST,PUT,DELETE,OPTIONS'
  },
  
  database: {
    url: process.env.DATABASE_URL || '',
    maxConnections: 10,
    timeout: 30000
  },
  
  defaults: {
    notification: {
      enabled: true,
      errorLevel: 'ERROR',
      serviceFilters: []
    }
  }
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500
} as const;
