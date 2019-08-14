class ErroHandle extends Error {
  constructor({ message, status }) {
    super(message);
    this.name = 'ErroHandleLib';
    this.status = status || 500;
  }
}

export default ErroHandle;
