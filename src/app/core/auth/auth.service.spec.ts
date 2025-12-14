import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = new AuthService();
  });

  it('should login with valid credentials', () => {
    const result = service.login('admin', 'admin');
    expect(result).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should fail login with invalid credentials', () => {
    const result = service.login('test', 'wrong');
    expect(result).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should logout user', () => {
    service.login('admin', 'admin');
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
  });
});
