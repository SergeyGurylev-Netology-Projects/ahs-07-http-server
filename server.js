const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const uuid = require('uuid');
const { Ticket, TicketDescription } = require('./src/ticket');

const app = new Koa();

const tickets = [];
const ticketsDescription = [];

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}))

app.use((ctx, next) => {
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');

  if (ctx.request.method !== 'OPTIONS') {
    next();
    return;
  }

  ctx.response.status = 204;
});

app.use((ctx, next) => {
  if (ctx.request.method !== 'DELETE') {
    next();
    return;
  }

  deleteTicket(ctx);
});

app.use(async (ctx, next) => {
  const { method } = ctx.request.query;

  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      return;
    case 'createTicket':
      createTicket(ctx);
      return;
    case 'editTicket':
      editTicket(ctx);
      return;
    case 'ticketById':
      ticketById(ctx);
      return;
    default:
      ctx.response.status = 404;
      ctx.response.body = 'method wasn\'t found';
      return;
  }
});

function createTicket(ctx) {
  const { name, description } = ctx.request.body;

  const ticket = new Ticket();
  ticket.id = uuid.v4();
  ticket.name = name;
  ticket.status = false;
  ticket.created = Date.now();
  tickets.push(ticket);

  const ticketDescription = new TicketDescription();
  ticketDescription.id = ticket.id;
  ticketDescription.description = description;
  ticketsDescription.push(ticketDescription);

  ctx.response.body = ticket;
}

function editTicket(ctx){
  const { id, name, status, description } = ctx.request.body;

  let ticket = tickets.find(t => t.id === id);
  let ticketDescription = ticketsDescription.find(t => t.id === id);

  if (!ticket) {
    setErrorStatus(ctx);
    return;
  }

  if (!ticketDescription) {
    ticketDescription = new TicketDescription();
    ticketDescription.id = id;
    ticketsDescription.push(ticketDescription);
  }

  ticket.name = name || ticket.name;
  ticket.status = status || ticket.status;
  ticketDescription.description = description || ticketDescription.description;

  ctx.response.body = {...ticket, ...ticketDescription};
}

function ticketById(ctx) {
  const { id } = ctx.request.query;

  const ticket = tickets.find(t => t.id === id);
  const ticketDescription = ticketsDescription.find(t => t.id === id);

  if (!ticket) {
    setErrorStatus(ctx);
    return;
  }

  ctx.response.body = {...ticket, ...ticketDescription};
}

function deleteTicket(ctx) {
  const { id } = ctx.request.query;

  const index = tickets.findIndex(t => t.id === id);

  if (index < 0) {
    setErrorStatus(ctx);
    return;
  }

  tickets.splice(index, 1);

  ctx.response.body = {result: 'OK'};
}

function setErrorStatus(ctx) {
  ctx.response.status = 404;
  ctx.response.body = 'ticket wasn\'t found';
}

const server = http.createServer(app.callback());

const port = 7070;

server.listen(port, (err) => {
  if (err) {
    console.log(err);

    return;
  }

  console.log('Server is listening to ' + port);
  console.log('Server is listening to ' + port);
});
