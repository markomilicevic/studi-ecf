import { Page } from "components/templates/Page";
import { AccountForm } from "components/organisms/AccountForm";

export default function Account() {
	const connect = () => {};

	return (
		<Page data-testid="account">
			<AccountForm connect={connect} />
		</Page>
	);
}
