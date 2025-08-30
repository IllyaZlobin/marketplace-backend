export interface IUseCase<T extends Record<any, any> = any> {
  execute(...args: unknown[]): Promise<T | void>;
}

export class UseCaseProxy<T> {
  constructor(private readonly useCase: T) {}
  getInstance(): T {
    return this.useCase;
  }
}
