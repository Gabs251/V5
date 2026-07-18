cookies: {
  getAll() {
    return request.cookies.getAll();
  },

  setAll(
    cookiesToSet: {
      name: string;
      value: string;
      options?: Record<string, any>;
    }[]
  ) {
    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

    response = NextResponse.next({ request });

    cookiesToSet.forEach(({ name, value, options }) =>
      response.cookies.set(name, value, options)
    );
  },
},