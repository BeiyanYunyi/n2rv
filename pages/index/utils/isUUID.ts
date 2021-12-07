const isUUID = (strToTest: string | undefined | null) => {
  if (typeof strToTest !== 'string') return false;
  const uuidRegex = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
  return uuidRegex.test(strToTest);
};

export default isUUID;
