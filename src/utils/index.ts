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
// utils/cookie.util.ts
export function getLatestCookieValue(
  cookies: Record<string, any> | undefined,
  cookieName: string
): string | null {
  if (!cookies || !cookies[cookieName]) {
    return null;
  }

  const value = cookies[cookieName];

  // Handle case where cookie-parser returns an array for duplicate keys
  if (Array.isArray(value)) {
    return value[value.length - 1];
  }

  // Handle case where cookie-parser returns a comma-separated string
  if (typeof value === 'string' && value.includes(',')) {
    const tokens = value.split(',');
    return tokens[tokens.length - 1].trim();
  }

  return value;
}
