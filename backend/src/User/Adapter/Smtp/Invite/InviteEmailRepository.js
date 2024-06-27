import Handlebars from "handlebars";

import { NodeMailerFactory } from "../../../../Common/Utils/nodemailer.js";

export default class InviteEmailRepository {
	async create({ email, firstName, lastName }) {
		// Templating are must have in order to avoid XSS
		// TODO: Use i18n
		const template = Handlebars.compile(`
            Bonjour <strong>{{lastName}} {{firstName}}</strong>,
            <br /><br />
            Votre compte employé Cinéphoria vient d'être créé
            <br /><br />
            Cordialement, l'équipe administrative de Cinéphoria
            `);

		const info = await NodeMailerFactory.getInstance()
			.getClient()
			.sendMail({
				from: process.env.EMAIL_FROM,
				to: email,
				// TODO: Use i18n
				subject: "Votre compte employé Cinéphoria",
				html: template({ email, firstName, lastName }),
			});

		return !!info.messageId;
	}
}
