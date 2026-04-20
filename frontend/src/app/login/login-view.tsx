"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Tabs } from "@heroui/react";

import SmoothImageSwap from "@/components/SmoothImageSwap";
import { PageContainer } from "@/components/layout/page-container";
import { useLoginMutation, useRegisterMutation } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";

type AccountType = "customer" | "owner";
type FormMode = "login" | "register";

type LoginFormState = {
	email: string;
	password: string;
};

type RegisterFormState = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
};

const loginDarkTheme = createTheme({
	shape: {
		borderRadius: 12,
	},
	palette: {
		mode: "dark",
		primary: { main: "#f59e0b" },
		background: { default: "#0c0a09", paper: "#1c1917" },
		text: { primary: "#fafaf9", secondary: "#a8a29e" },
	},
	components: {
		MuiTextField: {
			defaultProps: { variant: "outlined", size: "small" },
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
				notchedOutline: {
					borderRadius: 12,
				},
			},
		},
	},
});

function parseAccountTypeFromSearch(raw: string | null): AccountType | null {
	switch (raw?.trim().toLowerCase()) {
		case "owner":
		case "isletme":
			return "owner";
		case "customer":
		case "musteri":
			return "customer";
		default:
			return null;
	}
}

function parseFormModeFromSearch(raw: string | null): FormMode | null {
	switch (raw?.trim().toLowerCase()) {
		case "register":
		case "kayit":
			return "register";
		case "login":
		case "giris":
			return "login";
		default:
			return null;
	}
}

function resolveHeading(mode: FormMode, accountType: AccountType): string {
	switch (mode) {
		case "login":
			return accountType === "customer" ? "Hoş geldiniz" : "İşletme hesabınıza hoş geldiniz";
		case "register":
			return accountType === "customer" ? "Hemen kayıt olun" : "İşletmenizi kaydedin";
		default:
			return "Hoş geldiniz";
	}
}

function resolveSubHeading(mode: FormMode, accountType: AccountType): string {
	switch (mode) {
		case "login":
			return accountType === "customer"
				? "Müşteri hesabınızla hızlı giriş yapın."
				: "İşletme paneli için e-posta ve şifrenizle devam edin.";
		case "register":
			return accountType === "customer"
				? "Temel bilgilerinizle hesabınızı oluşturun."
				: "İşletme sahibi hesabınızı oluşturup yönetime geçin.";
		default:
			return "";
	}
}

function resolveImageByType(accountType: AccountType): string {
	switch (accountType) {
		case "owner":
			return "/login-business.jpg";
		case "customer":
		default:
			return "/login-customer.jpg";
	}
}

function getErrorMessage(error: unknown): string {
	if (error instanceof ApiError) {
		return error.message;
	}
	if (error instanceof Error) {
		return error.message;
	}
	return "Beklenmeyen bir hata oluştu";
}

export function LoginView() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const loginMutation = useLoginMutation();
	const registerMutation = useRegisterMutation();

	const accountType: AccountType = parseAccountTypeFromSearch(searchParams.get("type")) ?? "customer";
	const mode: FormMode = parseFormModeFromSearch(searchParams.get("tab")) ?? "login";

	const replaceLoginQuery = useCallback(
		(patch: Partial<{ type: AccountType; tab: FormMode }>) => {
			const next = new URLSearchParams(searchParams.toString());
			const resolvedType = patch.type ?? parseAccountTypeFromSearch(next.get("type")) ?? "customer";
			const resolvedTab = patch.tab ?? parseFormModeFromSearch(next.get("tab")) ?? "login";
			next.set("type", resolvedType);
			next.set("tab", resolvedTab);
			router.replace(`/login?${next.toString()}`);
		},
		[router, searchParams]
	);

	const [feedback, setFeedback] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");

	const [loginForm, setLoginForm] = useState<LoginFormState>({ email: "", password: "" });
	const [registerForm, setRegisterForm] = useState<RegisterFormState>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const isBusy = loginMutation.isPending || registerMutation.isPending;

	const toggleAccountType = () => {
		if (isBusy) {
			return;
		}
		setErrorMessage("");
		setFeedback("");
		replaceLoginQuery({ type: accountType === "customer" ? "owner" : "customer" });
	};

	const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage("");
		setFeedback("");
		try {
			const response = await loginMutation.mutateAsync({
				accountType,
				payload: {
					email: loginForm.email.trim(),
					password: loginForm.password,
				},
			});
			setFeedback(response.message);
			switch (response.user.role) {
				case "OWNER":
					router.push("/owner");
					break;
				case "CUSTOMER":
				case "ADMIN":
				default:
					router.push("/profile");
					break;
			}
		} catch (error) {
			setErrorMessage(getErrorMessage(error));
		}
	};

	const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage("");
		setFeedback("");

		if (registerForm.password !== registerForm.confirmPassword) {
			setErrorMessage("Şifre tekrar alanı şifre ile aynı olmalıdır");
			return;
		}

		try {
			const response = await registerMutation.mutateAsync({
				accountType,
				payload: {
					firstName: registerForm.firstName.trim(),
					lastName: registerForm.lastName.trim(),
					email: registerForm.email.trim(),
					password: registerForm.password,
				},
			});
			setFeedback(`${response.message} Şimdi giriş yapabilirsiniz.`);
			replaceLoginQuery({ tab: "login" });
			setLoginForm((prev) => ({ ...prev, email: registerForm.email.trim() }));
			setRegisterForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
		} catch (error) {
			setErrorMessage(getErrorMessage(error));
		}
	};

	const loginImages = [resolveImageByType("customer"), resolveImageByType("owner")] as const;
	const loginAlts = ["Müşteri giriş görseli", "İşletme giriş görseli"] as const;
	const imageActiveIndex: 0 | 1 = accountType === "customer" ? 0 : 1;

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-stone-950">
			<PageContainer
				maxWidth="site"
				className="flex flex-1 items-center justify-center py-8 sm:py-10"
			>
				<ThemeProvider theme={loginDarkTheme}>
					<section className="box-border h-[min(38rem,calc(100svh-var(--header-height)-2.5rem))] w-full max-w-4xl overflow-hidden rounded-3xl border border-stone-800 bg-stone-900 shadow-2xl shadow-black/40 md:h-152 md:w-4xl">
						<div className="grid h-full grid-cols-1 md:grid-cols-2">
							<div className="relative hidden min-h-44 overflow-hidden md:block">
								<div
									aria-hidden
									className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-stone-950/70 via-stone-950/20 to-transparent"
								/>
								<div
									className="absolute inset-0 overflow-hidden bg-stone-950"
									style={{ isolation: "isolate" }}
								>
									<SmoothImageSwap
										activeIndex={imageActiveIndex}
										alts={loginAlts}
										className="absolute inset-0 h-full w-full"
										images={loginImages}
										priorityFirst
									/>
								</div>
								<div className="absolute bottom-5 left-5 right-5 z-20 text-stone-50">
									<p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/90">
										Lezzetly
									</p>
									<p className="mt-1.5 text-lg font-semibold leading-snug">
										{accountType === "customer"
											? "Müşteri deneyimiyle hızlı rezervasyon"
											: "İşletme paneliyle rezervasyon yönetimi"}
									</p>
								</div>
							</div>

							<div className="flex h-full min-h-0 flex-col border-stone-800 bg-stone-950 md:border-l">
								<div className="shrink-0 border-b border-stone-800 px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
									<div className="flex items-center justify-between gap-3">
										<p className="text-xs font-medium uppercase tracking-wide text-stone-500">
											{accountType === "customer" ? "Müşteri hesabı" : "İşletme hesabı"}
										</p>
										<button
											className="rounded-md border border-stone-600/80 bg-stone-800/80 px-2 py-1 text-xs font-semibold text-stone-100 transition hover:border-stone-500 hover:bg-stone-700/90 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
											disabled={isBusy}
											onClick={toggleAccountType}
											type="button"
										>
											{accountType === "customer"
												? "İşletme sahibiyim"
												: "Müşteri girişine dön"}
										</button>
									</div>
								</div>

								<div className="flex min-h-0 flex-1 flex-col px-5 pb-4 pt-3 sm:px-6">
									<Tabs
										className="login-auth-tabs flex min-h-0 w-full flex-1 flex-col gap-0"
										selectedKey={mode}
										onSelectionChange={(key) => {
											if (key == null) {
												return;
											}
											replaceLoginQuery({ tab: String(key) as FormMode });
											setErrorMessage("");
											setFeedback("");
										}}
									>
										<Tabs.ListContainer>
											<Tabs.List aria-label="Kimlik işlemleri">
												<Tabs.Tab
													className="flex-1 px-3 py-2 text-center text-sm font-medium outline-none data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-amber-500/45"
													id="login"
												>
													Giriş yap
													<Tabs.Indicator />
												</Tabs.Tab>
												<Tabs.Tab
													className="flex-1 px-3 py-2 text-center text-sm font-medium outline-none data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-amber-500/45"
													id="register"
												>
													Kayıt ol
													<Tabs.Indicator />
												</Tabs.Tab>
											</Tabs.List>
										</Tabs.ListContainer>

										<Tabs.Panel
											className="flex min-h-0 flex-1 flex-col overflow-hidden pt-4 outline-none"
											id="login"
										>
											<h1 className="text-xl font-semibold tracking-tight text-stone-50">
												{resolveHeading("login", accountType)}
											</h1>
											<p className="mt-1 text-sm leading-relaxed text-stone-400">
												{resolveSubHeading("login", accountType)}
											</p>
											<div className="min-h-0 flex-1 overflow-y-auto py-3">
												<Box
													component="form"
													id="login-form"
													noValidate
													onSubmit={handleLoginSubmit}
													sx={{
														display: "flex",
														flexDirection: "column",
														justifyContent: "center",
														gap: 2,
														minHeight: "100%",
													}}
												>
													<TextField
														fullWidth
														label={accountType === "owner" ? "İşletme e-postası" : "E-posta"}
														onChange={(event) =>
															setLoginForm((prev) => ({ ...prev, email: event.target.value }))
														}
														required
														type="email"
														value={loginForm.email}
														variant="outlined"
													/>
													<TextField
														fullWidth
														label="Şifre"
														onChange={(event) =>
															setLoginForm((prev) => ({
																...prev,
																password: event.target.value,
															}))
														}
														required
														type="password"
														value={loginForm.password}
														variant="outlined"
													/>
												</Box>
											</div>
											<div className="shrink-0 border-t border-stone-800 pt-4">
												{errorMessage && mode === "login" ? (
													<p className="mb-3 text-sm font-medium text-red-400">{errorMessage}</p>
												) : null}
												{feedback && mode === "login" ? (
													<p className="mb-3 text-sm font-medium text-emerald-400">{feedback}</p>
												) : null}
												<button
													className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
													disabled={isBusy}
													form="login-form"
													type="submit"
												>
													{loginMutation.isPending ? "Giriş yapılıyor…" : "Giriş yap"}
												</button>
											</div>
										</Tabs.Panel>

										<Tabs.Panel
											className="flex min-h-0 flex-1 flex-col overflow-hidden pt-4 outline-none"
											id="register"
										>
											<h1 className="text-xl font-semibold tracking-tight text-stone-50">
												{resolveHeading("register", accountType)}
											</h1>
											<p className="mt-1 text-sm leading-relaxed text-stone-400">
												{resolveSubHeading("register", accountType)}
											</p>
											<div className="min-h-0 flex-1 overflow-y-auto py-3">
												<Box
													component="form"
													id="register-form"
													noValidate
													onSubmit={handleRegisterSubmit}
													sx={{
														display: "flex",
														flexDirection: "column",
														justifyContent: "center",
														gap: 2,
														minHeight: "100%",
													}}
												>
													<TextField
														fullWidth
														label="Ad"
														onChange={(event) =>
															setRegisterForm((prev) => ({
																...prev,
																firstName: event.target.value,
															}))
														}
														required
														value={registerForm.firstName}
														variant="outlined"
													/>
													<TextField
														fullWidth
														label="Soyad"
														onChange={(event) =>
															setRegisterForm((prev) => ({
																...prev,
																lastName: event.target.value,
															}))
														}
														required
														value={registerForm.lastName}
														variant="outlined"
													/>
													<TextField
														fullWidth
														label={accountType === "owner" ? "İşletme e-postası" : "E-posta"}
														onChange={(event) =>
															setRegisterForm((prev) => ({
																...prev,
																email: event.target.value,
															}))
														}
														required
														type="email"
														value={registerForm.email}
														variant="outlined"
													/>
													<TextField
														fullWidth
														label="Şifre"
														onChange={(event) =>
															setRegisterForm((prev) => ({
																...prev,
																password: event.target.value,
															}))
														}
														required
														type="password"
														value={registerForm.password}
														variant="outlined"
													/>
													<TextField
														fullWidth
														label="Şifre tekrar"
														onChange={(event) =>
															setRegisterForm((prev) => ({
																...prev,
																confirmPassword: event.target.value,
															}))
														}
														required
														type="password"
														value={registerForm.confirmPassword}
														variant="outlined"
													/>
												</Box>
											</div>
											<div className="shrink-0 border-t border-stone-800 pt-4">
												{errorMessage && mode === "register" ? (
													<p className="mb-3 text-sm font-medium text-red-400">{errorMessage}</p>
												) : null}
												{feedback && mode === "register" ? (
													<p className="mb-3 text-sm font-medium text-emerald-400">{feedback}</p>
												) : null}
												<button
													className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
													disabled={isBusy}
													form="register-form"
													type="submit"
												>
													{registerMutation.isPending ? "Kayıt oluşturuluyor…" : "Kayıt ol"}
												</button>
											</div>
										</Tabs.Panel>
									</Tabs>
								</div>
							</div>
						</div>
					</section>
				</ThemeProvider>
			</PageContainer>
		</div>
	);
}
