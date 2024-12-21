import React, { useState } from "react";
import { register } from "../utils/fetch";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

export default function Register() {
	const [credentials, setCredentials] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await register(credentials);
			alert("Registrasi berhasil! Silakan login.");
			navigate("/login");
		} catch (error) {
			console.error("Registrasi gagal:", error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
				<div>
					<h2 className="text-left text-3xl font-bold text-gray-900">
						Register
					</h2>
					<p className="mt-2 text-left text-sm text-gray-600">
						Silahkan masukan data diri Anda
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-bold text-gray-700"
							>
								Nama
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								className="mt-2 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Masukan nama"
								value={credentials.name}
								onChange={(e) =>
									setCredentials({ ...credentials, name: e.target.value })
								}
							/>
						</div>
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
							<div className="relative mt-2">
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"} // Mengubah tipe input berdasarkan showPassword
									required
									className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
							Register
						</button>
					</div>
				</form>
				<p className="mt-4 text-sm text-center">
					Sudah punya akun?{" "}
					<Link to="/login" className="text-blue-600 hover:underline">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
