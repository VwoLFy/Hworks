type FieldErrorType = {
  message: string;
  field: string;
};
export type BadRequestError = {
  errorsMessages: FieldErrorType[];
};

export const testCheckBadRequestError = (apiErrorResult: BadRequestError, field: string | string[]): void => {
  if (Array.isArray(field)) {
    if (apiErrorResult.errorsMessages.length !== field.length) throw new Error('bad check Error!');
    for (const resultElement of apiErrorResult.errorsMessages) {
      if (!field.includes(resultElement.field)) throw new Error('bad check Error!');
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
