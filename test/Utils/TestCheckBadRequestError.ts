import { BadRequestError } from '../../src/middlewares/input-validation-middleware';

export const testCheckBadRequestError = (apiErrorResult: BadRequestError, field: string | string[]): void => {
  if (Array.isArray(field)) {
    if (apiErrorResult.errorsMessages.length !== field.length) throw new Error('bad check Error! (quantity of errors)');
    for (const resultElement of apiErrorResult.errorsMessages) {
      if (!field.includes(resultElement.field)) throw new Error('bad check Error! (not  valid error field)');
    }
    return;
  }
  expect(apiErrorResult).toEqual({
    errorsMessages: [
      {
        message: expect.any(String),
        field,
      },
    ],
  });
};
