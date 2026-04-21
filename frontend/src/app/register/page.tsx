import { redirect } from "next/navigation";

export default function RegisterPage(): never {
	redirect("/login?type=owner&tab=register");
}
