import { beforeEach, describe, expect, it } from 'vitest';
import {
  setProfileToLS,
  getProfileFromLS,
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '../auth';

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjI5NzJkOTdlOTU5MDMzNzJmMTEwNiIsImVtYWlsIjoicXVhbmdkYXQzODVAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wOS0xNVQwMTo0OTo1OC4zMzBaIiwiaWF0IjoxNjk0NzQyNTk4LCJleHAiOjE2OTQ4Mjg5OTh9.eDr7P2dr0P7p60PrO0M9zn9LQV6gIvCKNsrGm62ELdw';
const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjI5NzJkOTdlOTU5MDMzNzJmMTEwNiIsImVtYWlsIjoicXVhbmdkYXQzODVAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wOS0xNVQwMTo0OTo1OC4zMzBaIiwiaWF0IjoxNjk0NzQyNTk4LCJleHAiOjE3MDg1NjY1OTh9.8xnROFiLEdsyVTUQ-MOA862QloyCnRHVVdek0ZBzO1c';
const profile =
  '{"_id":"6374a6115fdc5f037e6f694b","roles":["User"],"email":"d7@gmail.com","createdAt":"2022-11-16T08:57:53.872Z","updatedAt":"2022-12-05T06:55:57.846Z","__v":0,"date_of_birth":"1997-01-13T17:00:00.000Z","name":"Dư Thanh Được 3","address":"Da nang, Vietnam","avatar":"44f75461-560e-42b5-a9d7-2b833a9f4d67.jpg","phone":"11111111111"}';

beforeEach(() => {
  localStorage.clear();
});

describe('access_token', () => {
  it('access_token được lưu vào localstorage', () => {
    console.log('access_token');
    setAccessTokenToLS(access_token);
    expect(getAccessTokenFromLS()).toBe(access_token);
  });
});
describe('profile', () => {
  it('profile được lưu vào localstorage', () => {
    const User = JSON.parse(profile);
    setProfileToLS(User);
    expect(getProfileFromLS()).toEqual(User);
  });
});

describe('refresh_token', () => {
  it('refresh_token được set vào localStorage', () => {
    setRefreshTokenToLS(refresh_token);
    expect(getRefreshTokenFromLS()).toEqual(refresh_token);
  });
});

describe('clearLS', () => {
  it('Xóa hết access_token, refresh_token, profile', () => {
    setRefreshTokenToLS(refresh_token);
    setAccessTokenToLS(access_token);
    // setProfile tại đây
    // ...
    clearLS();
    expect(getAccessTokenFromLS()).toBe('');
    expect(getRefreshTokenFromLS()).toBe('');
  });
});
