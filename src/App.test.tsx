import { describe, expect, test } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from './utils/__test__/testUtils';
import path from './constants/path';

describe('App', () => {
  test('App render và chuyển trang', async () => {
    const { user } = renderWithRouter();
    // Verify vào đúng trang chủ
    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('Trang chủ | Shopee Clone');
    });
    screen.debug(document.body as HTMLElement, 999999999999);

    // Verify chuyển sang trang login
    await user.click(screen.getByText(/Đăng nhập/i));
    await waitFor(() => {
      expect(screen.queryByText('Bạn chưa có tài khoản?')).toBeDefined();
      expect(document.querySelector('title')?.textContent).toBe('Đăng nhập | Shopee Clone');
    });
  });
  test('Về trang not found', async () => {
    const badRoute = '/some/bad/route';
    renderWithRouter({ route: badRoute });
    await waitFor(() => {
      expect(screen.getByText(/Page Not Found/i)).toBeDefined();
    });
    // screen.debug(document.body.parentElement as HTMLElement, 99999999);
  });
  test('Render trang register', async () => {
    renderWithRouter({ route: path.register });
    await waitFor(() => {
      expect(screen.getByText(/Bạn đã có tài khoản?/i)).toBeDefined();
    });
    // screen.debug(document.body.parentElement as HTMLElement, 99999999);
  });
});
