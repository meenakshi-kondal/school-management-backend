import { Response } from "express";

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string
) => {
  return res.status(statusCode).json({
    success: true,
    message,
  });
};

export const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  message: string,
  body: {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: body
  });
};