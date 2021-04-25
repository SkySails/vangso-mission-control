export const omit = <Type>(obj: Type, keysToRemove: (keyof Type)[]): Type => {
  const copy = { ...obj };
  keysToRemove.forEach((key) => delete copy[key]);
  return copy;
};
