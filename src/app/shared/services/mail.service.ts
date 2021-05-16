import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { config, transporter } from "../../config/app.config";
import { OrderFields } from "../../utils/shared.types";
import { OrderEntity, StuffEntity } from "../../entities";

@Injectable()
export class MailService {
  constructor(
    @Inject(Logger)
    private logger: LoggerService,
  ) {}

  async send(email: string, text: string, subject: string): Promise<void> {
    await transporter
      .sendMail({
        from: `"${subject}" ${config.MAIL_SENDER}`,
        subject,
        to: email,
        text: text,
        html: text,
      })
      .catch((error) => {
        this.logger.error('Sending email rejected: ' + email);
        throw error;
      });
  }

  getNewOrderText({
    id,
    createdAt,
    updatedAt,
    customerName,
    catalog,
    stuff,
    orderQuantity,
    orderAmount,
    stuffQuantity,
    stuffAmount,
    status,
  }: OrderFields): string {
    const htmlText = `<body style="font-family: Cambria, Rockwell, serif;font-size: 16px; max-width: 800px; margin-left: auto; margin-right: auto;">
    <h3>Dear admin! This is your <span style="font-family: Kaushan Script, sans-serif; color: #5583ff">@techbot</span></h3>
    <p>I received information about order. Here is goes:</p>
    <ul>
      <li><b>Order status: </b>${status}</li>
      <li><b>Order id: </b>${id}</li>
      <li><b>Order was created at: </b>${createdAt}</li>
      <li><b>Order was updated at: </b>${updatedAt}</li>
      <li><b>Customer name: </b>${customerName}</li>
      <li><b>Catalog name: </b>${catalog}</li>
      <li><b>Stuff: </b>${stuff}</li>
      <li><b>Customer ordered next quantity: </b>${orderQuantity}</li>
      <li><b>Customer has to pay: </b>${orderAmount}</li>
      <li><b>Stuff left at the stock: </b>${stuffQuantity}</li>
      <li><b>Cost of stuff at stock: </b>${stuffAmount}</li>
    </ul>
    <img width="390" height="500" src="https://uploads-ssl.webflow.com/5c99a2b7f7d06d83b8d7d285/5cab03cdd636b72c9e612e31_Ava%20Wave%20wink%20Animation%20with%20shadow.gif" alt="Bot gif"/>
     <h4 style="color: #000000">Best wishes, your <span style="font-family: Kaushan Script, sans-serif; color: #5583ff">@techbot</span></h4>
    </body>`;
    return htmlText;
  }

  getOrdersString(orders: OrderEntity[], title: string): string {
    return orders.reduce((acc, order) => {
      return (acc += `
      <b>Order id: </b>${order.id};\n
      <b>Order status: </b>${order.status};\n
      <b>Order was created at: </b>${order.createdAt.toLocaleString()};\n
      <b>Order was updated at: </b>${order.updatedAt.toLocaleString()};\n
      <b>Customer name: </b>${order.users.name};\n
      <b>Catalog name: </b>${order.stuff.catalog.name};\n
      <b>Stuff: </b>${order.stuff.name};\n
      <b>Customer ordered next quantity: </b>${order.quantity};\n
      <b>Customer has to pay: </b>${order.amount};\n
      <b>Stuff left at the stock: </b>${order.stuff.quantity};\n
      <b>Cost of stuff at stock: </b>${order.stuff.amount};\n
      **************************************************************************
      `);
    }, title);
  }

  getStuffString(stuff: StuffEntity[], title: string): string {
    return stuff.reduce((acc, x) => {
      return (acc += `
      <b>Stuff id: </b>${x.id};\n
      <b>Stuff was created at: </b>${x.createdAt.toLocaleString()};\n
      <b>Stuff was updated at: </b>${x.updatedAt.toLocaleString()};\n
      <b>Catalog name: </b>${x.catalog.name};\n
      <b>Stuff: </b>${x.name};\n
      <b>Stuff at the stock: </b>${x.quantity};\n
      <b>Cost of stuff at stock: </b>${x.amount};\n
      **************************************************************************
      `);
    }, title);
  }
}
