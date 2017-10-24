import { ProyectoSTTPage } from './app.po';

describe('proyecto-stt App', () => {
  let page: ProyectoSTTPage;

  beforeEach(() => {
    page = new ProyectoSTTPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
