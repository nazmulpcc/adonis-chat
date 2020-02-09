'use strict'

/*
* https://adonisjs.com/docs/websocket
*/

const Ws = use('Ws')

Ws.channel('chat', ({ socket }) => {
  console.log('user joined with %s socket id', socket.id)
  socket.emit('message', 'Hello world')
})
