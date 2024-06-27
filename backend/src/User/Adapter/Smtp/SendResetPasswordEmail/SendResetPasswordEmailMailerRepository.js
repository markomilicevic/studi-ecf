import Handlebars from "handlebars";

import { NodeMailerFactory } from "../../../../Common/Utils/nodemailer.js";

export default class SendResetPasswordEmailMailerRepository {
	async create({ email, resetPasswordToken }) {
		if (!process?.env?.WEBSITE_BASE_URL) {
			throw new Error("Missing WEBSITE_BASE_URL env variable");
		}

		// Templating are must have in order to avoid XSS
		// TODO: Use i18n
		const template = Handlebars.compile(`
            Bonjour,
            <br /><br />
            Cliquer sur le lien suivant pour changer votre mot de passe Cinéphoria : 
            <a href="{{websiteBaseUrl}}/account/reset/{{resetPasswordToken}}">Changer mon mot de passe</a>
            <br /><br />
            À très bientôt
            `);

		const info = await NodeMailerFactory.getInstance()
			.getClient()
			.sendMail({
				from: process.env.EMAIL_FROM,
				to: email,
				// TODO: Use i18n
				subject: "Changer votre mot de passe Cinéphoria",
				html: template({ email, resetPasswordToken, websiteBaseUrl: process.env.WEBSITE_BASE_URL }),
			});

		return !!info.messageId;
	}
}
