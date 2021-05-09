module.exports = function(app) {

  let users = {
    1: {
      id: '1',
      username: 'Robin Wieruch',
    },
    2: {
      id: '2',
      username: 'Dave Davids',
    },
  };

  app.get('/users', (request, response) => {
    return response.send(Object.values(users));
  });

  app.get('/users/:userId', (request, response) => {
    return response.send(users[request.params.userId]);
  });
}