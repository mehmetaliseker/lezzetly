import { redirect } from "next/navigation";

export default function OwnerPage(): never {
	redirect("/owner/welcome");
}
