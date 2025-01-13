import { Container } from 'inversify';

export default (): Container => {
  const container = new Container();

  container.load();

  return container;
};
