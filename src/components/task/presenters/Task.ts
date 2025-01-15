import { TaskResponseData } from '../../../types/task';

export class TaskPresenter {
  static taskPresenter(data: TaskResponseData) {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      userId: data.userId,
      status: data.status,
    };
  }
}
