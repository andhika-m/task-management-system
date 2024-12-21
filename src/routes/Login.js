import React, { useState } from "react";
import { login } from "../utils/fetch";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

export default function Login() {
	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage("");

		try {
			await login(credentials);
			navigate("/dashboard");
		} catch (error) {
			if (error.response) {
				setErrorMessage("Email atau Password salah.");
			} else {
				setErrorMessage("Terjadi kesalahan, silakan coba lagi.");
			}
			console.error("Login failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
				<div>
					<h2 className="text-left text-3xl font-bold text-gray-900">Login</h2>
					<p className="mt-2 text-left text-sm text-gray-600">
						Silahkan masukan username dan password
					</p>
				</div>
				{errorMessage && ( // Menampilkan pesan error jika ada
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
						<span className="block sm:inline">{errorMessage}</span>
					</div>
				)}
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-bold text-gray-700"
							>
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								className="mt-2 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Masukan email"
								value={credentials.email}
								onChange={(e) =>
									setCredentials({ ...credentials, email: e.target.value })
								}
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-bold text-gray-700"
							>
								Password
							</label>
							<div className="mt-2 relative rounded-md shadow-sm">
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									className="block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Masukan password"
									value={credentials.password}
									onChange={(e) =>
										setCredentials({ ...credentials, password: e.target.value })
									}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
								>
									{showPassword ? (
										<EyeOffIcon className="h-5 w-5 text-gray-400" />
									) : (
										<EyeIcon className="h-5 w-5 text-gray-400" />
									)}
								</button>
							</div>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-medium font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Login
						</button>
					</div>
				</form>
				<p className="mt-4 text-sm text-center">
					Belum punya akun?{" "}
					<Link to="/register" className="text-blue-600 hover:underline">
						Register
					</Link>
				</p>
			</div>
		</div>
	);
}
