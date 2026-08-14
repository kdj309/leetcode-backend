import { judgeApi } from 'src/api';
import { batchsubmission } from 'src/interfaces/config.interface';
async function batchwiseSubmission<T>(problems: T) {
  try {
    const response = await judgeApi.post<batchsubmission[]>(
      `/submissions/batch`,
      {
        submissions: problems,
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(String(error));
    }
  }
}

export default batchwiseSubmission;
