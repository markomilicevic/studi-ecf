import Handlebars from "handlebars";

import { NodeMailerFactory } from "../../../../Common/Utils/nodemailer.js";

export default class ContactCinemaMailerRepository {
	async create({ userName, countryCode, cinemaName, subject, body }) {
		// Templating are must have in order to avoid XSS
		// TODO: Use i18n
		const template = Handlebars.compile(`
			Date : {{date}}
            {{#if userName}}
				<p>Nom d'utilisateur : <strong>{{userName}}</strong></p>
			{{/if}}
			{{#if countryCode}}
				<p>Code pays : <strong>{{countryCode}}</strong></p>
			{{/if}}
			{{#if cinemaName}}
				<p>Nom du cinéma : <strong>{{cinemaName}}</strong></p>
			{{/if}}
			<p>Sujet : <strong>{{subject}}</strong></p>
			<p>Message :<br /><pre>{{body}}</pre></p>
            `);

		const info = await NodeMailerFactory.getInstance()
			.getClient()
			.sendMail({
				from: process.env.EMAIL_FROM,
				to: process.env.EMAIL_PUBLIC_TO,
				// TODO: Use i18n
				subject: `Nouveau message Cinéphoria : ${subject}`,
				html: template({ date: new Date().toUTCString(), userName, countryCode, cinemaName, subject, body }),
			});

		return !!info.messageId;
	}
}
