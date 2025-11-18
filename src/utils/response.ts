import { APIGatewayProxyResult } from 'aws-lambda';
import { config, HTTP_STATUS } from '../config';
import { ApiResponse } from '../types';

const defaultHeaders = {
  'Access-Control-Allow-Origin': config.cors.allowOrigin,
  'Content-Type': 'application/json'
};

export const createResponse = (
  statusCode: number,
  data: any,
  headers: Record<string, string> = {}
): APIGatewayProxyResult => ({
  statusCode,
  headers: { ...defaultHeaders, ...headers },
  body: JSON.stringify(data)
});

export const success = <T>(data: T): APIGatewayProxyResult => 
  createResponse(HTTP_STATUS.OK, data);

export const created = <T>(data: T): APIGatewayProxyResult => 
  createResponse(HTTP_STATUS.CREATED, data);

export const badRequest = (message: string): APIGatewayProxyResult => 
  createResponse(HTTP_STATUS.BAD_REQUEST, { error: message });

export const unauthorized = (message: string = 'Unauthorized'): APIGatewayProxyResult => 
  createResponse(HTTP_STATUS.UNAUTHORIZED, { error: message });

export const notFound = (message: string = 'Not found'): APIGatewayProxyResult => 
  createResponse(HTTP_STATUS.NOT_FOUND, { error: message });

export const methodNotAllowed = (): APIGatewayProxyResult => 
  createResponse(HTTP_STATUS.METHOD_NOT_ALLOWED, { error: 'Method not allowed' });

export const internalError = (message: string = 'Internal server error'): APIGatewayProxyResult => 
  createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, { error: message });
