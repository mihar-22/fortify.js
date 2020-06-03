
// Two drivers?? -> database, cookie


// Sessions are stored in encrypted cookies. or maybe iron-store
export default class Index {
  // eslint-disable-next-line class-methods-use-this
  put(key: string, value: any) {
    console.log(`Storing in session ${key}:${value}`);
  }

  // eslint-disable-next-line class-methods-use-this
  pull(key: string): undefined | string {
    console.log(`retrieving from session ${key}`);
    return undefined;
  }
}
