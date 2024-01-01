class Ticket {
  constructor() {
    this.id = undefined;
    this.name = undefined;
    this.status = undefined;
    this.created = undefined;
  }
}

class TicketDescription {
  constructor() {
    this.id = undefined;
    this.description = undefined;
  }
}

module.exports = { Ticket: Ticket, TicketDescription: TicketDescription };
