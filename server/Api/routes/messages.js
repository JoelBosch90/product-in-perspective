module.exports = function(app) {

  const { v4: uuid } = require('uuid');

  let messages = {
    1: {
      id: '1',
      text: 'Hello World',
      userId: '1',
    },
    2: {
      id: '2',
      text: 'By World',
      userId: '2',
    },
  };

  app.get('/messages', (request, response) => {
    return response.send(Object.values(messages));
  });

  app.get('/messages/:messageId', (request, response) => {
    return response.send(messages[request.params.messageId]);
  });

  app.post('/messages', (request, response) => {
    const id = uuid();
    const message = {
      id,
      text: request.body.text,
    };

    messages[id] = message;

    return response.send(message);
  });
}