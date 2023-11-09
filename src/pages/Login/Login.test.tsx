import { screen, waitFor, fireEvent } from '@testing-library/react';
import path from 'src/constants/path';
import { renderWithRouter } from 'src/utils/__test__/testUtils';
import { beforeAll, describe, expect, it } from 'vitest';

describe('Login', () => {
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let submitButton: HTMLButtonElement;
  beforeAll(async () => {
    renderWithRouter({ route: path.login });
    await waitFor(() => {
      expect(screen.getByText(/Bạn chưa có tài khoản ?/i)).toBeTruthy();
    });

    emailInput = document.querySelector('form input[type="email"]') as HTMLInputElement;
    passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement;
    submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
  });
  it('Hiển thị lỗi required khi không nhập gì', async () => {
    fireEvent.submit(submitButton);
    await waitFor(() => {
      expect(screen.queryByText('Email là bắt buộc')).toBeTruthy();
      expect(screen.queryByText('Password là bắt buộc')).toBeTruthy();
    });
  });
  it('Hiển thị lỗi khi nhập value input sai', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'test@mail'
      }
    });
    fireEvent.change(passwordInput, {
      target: {
        value: '123'
      }
    });
    fireEvent.submit(submitButton);
    console.log(emailInput.value);
    await waitFor(() => {
      expect(screen.queryByText('Email không đúng định dạng')).toBeDefined();
      expect(screen.queryByText('Độ dài từ 5 - 160 ký tự')).toBeDefined();
    });
  });

  it('Không nên hiển thị lỗi khi nhập lại value đúng', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'd3@gmail.com'
      }
    });
    fireEvent.change(passwordInput, {
      target: {
        value: 'useruser'
      }
    });
    // Những trường hợp chứng minh rằng tìm không ra text hay là element
    // Thì nên dùng query hơn là find hay get
    await waitFor(() => {
      expect(screen.queryByText('Email không đúng định dạng')).toBeFalsy();
      expect(screen.queryByText('Độ dài từ 6 - 160 ký tự')).toBeFalsy();
    });
    fireEvent.submit(submitButton);
    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('Trang chủ | Shopee Clone');
    });
    screen.debug(document.body.parentElement as HTMLElement, 99999999);
    // console.log(await screen.findByText('Email không đúng định dạng'))
  });
});
