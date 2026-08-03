import { judgeApi } from 'src/api';

interface submitCodeArgs {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
}
async function submitCode(params: submitCodeArgs) {
  try {
    const response = await judgeApi.post('/submissions', {
      source_code: params.source_code,
      language_id: params.language_id,
      stdin: params.stdin,
      expected_output: params.expected_output,
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`error in submitcode of judge api ${error}`);
    }else { throw error; }
  }
}
export default submitCode;
