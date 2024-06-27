import { Footer } from "components/organisms/Footer";
import { Header } from "components/organisms/Header";

import "./page.css";
import { ContentLayout, Layout } from "./page.style";

export default function Page({ children, ...rest }) {
	return (
		<>
			<Layout style={{ paddingBottom: 20 }} {...rest}>
				<ContentLayout>
					<Header />
				</ContentLayout>

				<hr />

				<ContentLayout>
					<section>{children}</section>
				</ContentLayout>
			</Layout>

			<ContentLayout style={{ marginTop: "auto" }}>
				<Footer />
			</ContentLayout>
		</>
	);
}
