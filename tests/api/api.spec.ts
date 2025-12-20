import { test, expect } from '@playwright/test';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

test('GET all posts - schema validation ', async ({ request }) => {
  const response = await request.get(`${API_BASE_URL}/posts`);

  expect(response.status()).toBe(200);

  const body = await response.json();
    for (const post of body) {
      expect(post).toMatchObject({
        userId: expect.any(Number),
        id: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
      });
    }
});

test('GET all posts - invalid endpoint (negative)', async ({ request }) => {
  const response = await request.get(`${API_BASE_URL}/postssss`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toEqual({});
})

test('GET single post - valid id', async ({ request }) => {
    const postId = 1;
    const response = await request.get(`${API_BASE_URL}/posts/${postId}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toEqual(postId);
})

test('GET single post - invalid id', async ({ request }) => {
    const postId = 999;
    const response = await request.get(`${API_BASE_URL}/posts/${postId}`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toEqual({});

})

test('POST create post - positive', async ({ request }) => {
  const payload = {
    userId: 11,
    title: 'Playwright API Test',
    body: 'Creating post using Playwright',
  };

  const response = await request.post(`${API_BASE_URL}/posts`, {
    data: payload,
  });

  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  expect(responseBody).toMatchObject(payload);
});

test.fail('POST create post - negative', async ({ request }) => {
  const payload = {
    userId: 11,
    title: 1234,
    body: null,
  };

  const response = await request.get(`${API_BASE_URL}/posts`, {
    data: payload,
  });

  expect(response.status()).toBe(400);

  const responseBody = await response.json();

//   expect(responseBody.id).toEqual(payload.id);
//   expect(responseBody).toMatchObject(payload);
});

test('PATCH update post - positive', async ({ request }) => {
    const postId = 101;
  const patchPayload = {
    title: 'Updated Title via PATCH',
  };

  const response = await request.patch(`${API_BASE_URL}/posts/${postId}`, {
    data: patchPayload,
  });

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.title).toBe(patchPayload.title);
  
});

test('DELETE post - positive', async ({ request }) => {
    const postId = 101;
  const response = await request.delete(`${API_BASE_URL}/posts/${postId}`);

  expect(response.status()).toBe(200);
});

test('DELETE post - negative', async ({ request }) => {
    const postId = 9999;
  const response = await request.delete(`${API_BASE_URL}/posts/${postId}`);

  expect(response.status()).toBe(200);
});

test('GET posts - Performance < 500ms', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${API_BASE_URL}/posts`);
    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    console.log(`Response time: ${duration} ms`);
    expect(duration).toBeLessThan(500);
  });

test('GET posts - Pagination', async ({ request }) => {
    const page = 1;
    const limit = 10;

    const response = await request.get(`${API_BASE_URL}/posts?_page=${page}&_limit=${limit}`);

    expect(response.status()).toBe(200);
    const posts = await response.json();
    console.log(`Number of posts returned: ${posts.length}`);
    expect(posts.length).toBeLessThanOrEqual(limit);

    for (const post of posts) {
      expect(post).toMatchObject({
        userId: expect.any(Number),
        id: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
      });
    }
  });

test.fail('POST multiple posts in parallel', async ({ request }) => {
  const payloads = [
    { userId: 12, title: 'Post 1', body: 'Content 1' },
    { userId: 22, title: 'Post 2', body: 'Content 2' },
    { userId: 32, title: 'Post 3', body: 'Content 3' },
    { userId: 42, title: 'Post 4', body: 'Content 4' },
    { userId: 52, title: 'Post 5', body: 'Content 5' },
  ];

  const responses = await Promise.all(
    payloads.map(payload => request.post(`${API_BASE_URL}/posts`, { data: payload }))
  );

const responseBodies: number[] = [];

  for (const response of responses) {
    expect(response.status()).toBe(201);
    const body = await response.json();
    responseBodies.push(body.id);

    expect(body).toMatchObject({
      userId: expect.any(Number),
      id: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
    });
  }

  for(const id of responseBodies) {
    console.log('Created post ID:', id);
  }

  const uniqueIds = new Set(responseBodies);
    expect(uniqueIds.size).toBe(responseBodies.length);

});





