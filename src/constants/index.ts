const commonLanguages = [
  { id: 50, name: 'C' },
  { id: 54, name: 'C++' },
  { id: 51, name: 'C#' },
  { id: 95, name: 'Go' },
  { id: 91, name: 'Java' },
  { id: 93, name: 'JavaScript' },
  { id: 92, name: 'Python' },
];
export { commonLanguages };
export const getSuccessResponse = (data: any, message: string) => {
  return {
    data,
    message,
    status: 'Success',
  };
};
export const getFailureResponse = (error: string) => {
  return {
    status: 'Failure',
    error: error,
  };
};
