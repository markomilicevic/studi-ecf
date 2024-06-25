import Handlebars from "handlebars";

import { NodeMailerFactory } from "../../../../Common/Utils/nodemailer.js";

export default class SignupEmailRepository {
	async create({ email, userName }) {
		// Templating are must have in order to avoid XSS
		// TODO: Use i18n
		const template = Handlebars.compile(`
            Bonjour <strong>{{userName}}</strong> !
			<br /><br />
			Votre compte Cinéphoria vient d'être créé
			<br /><br />
			À très bientôt
            `);

		const info = await NodeMailerFactory.getInstance()
			.getClient()
			.sendMail({
				from: process.env.EMAIL_FROM,
				to: email,
				// TODO: Use i18n
				subject: "Bienvenue sur Cinéphoria",
				html: template({ userName }),
			});

		return !!info.messageId;
	}
}
