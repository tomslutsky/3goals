export function randomizeList<T>(list: T[], offet: number = 0) {
  if (list.length <= offet || offet < 0) {
    return list;
  }
  const listLength = list.length;
  const offset = offet % listLength;
  const sut = list.slice(offset).concat(list.slice(0, offset));
  return sut;
}
