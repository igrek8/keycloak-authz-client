export class ResponseError extends Error {
  override name = this.constructor.name;

  constructor(public response: Response) {
    super(response.statusText);
  }
}
