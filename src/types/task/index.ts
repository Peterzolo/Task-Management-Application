export interface ICreateTask {
  title: string;
  userId?: string;
  description: string;
  dueDate?: string;
}

export interface IReadTask {
  id?: string;
  status: string;
}

export interface TaskResponseData {
  id?: string;
  userId?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ITask {
  id?: string;
  userId?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum TaskStatus {
  Pending = 'PENDING',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
}
