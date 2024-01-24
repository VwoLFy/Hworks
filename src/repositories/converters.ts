import { ObjectId } from 'mongodb';

export const converters = {
  _id<T extends { _id: ObjectId }, A extends Omit<T, '_id'> & { id: string }>(object: T): A {
    const { _id, ...objectWithoutId } = object;
    return { ...objectWithoutId, id: _id.toString() } as A;
  },

  id<T extends { id: string }, A extends Omit<T, 'id'> & { _id: ObjectId }>(object: T): A {
    const { id, ...objectWithoutId } = object;
    return { ...objectWithoutId, _id: new ObjectId(id) } as A;
  },
};
