export function convertQueryBooleanString(query: any) {
  const newObject: Record<string, any> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === 'false') {
      newObject[key] = false;
    }
    if (value === 'true') {
      newObject[key] = true;
    }
  }
  return { ...query, ...newObject };
}
