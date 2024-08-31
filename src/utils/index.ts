// function getSuccessResponse<T>(data: <T>, message: string):<T>  {
//     return {
//       data,
//       message,
//       status: 'Success',
//     };
//   };
export const getSuccessResponse = <Type>(data: Type, message: string) => {
  return { data, message, status: 'Success' };
};
// export  function getSuccessResponse<Type>(data: Type,message:string): Type {
//     return {...data,message,status:"Success"};
//   }
export const getFailureResponse = (error: string) => {
  return {
    status: 'Failure',
    error: error,
  };
};
