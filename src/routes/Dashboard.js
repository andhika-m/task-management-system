// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { getTasks, deleteTask } from "../utils/fetch";
import TaskModal from "./TaskModal";

export default function Dashboard() {
	const [tasks, setTasks] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTask, setSelectedTask] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const user = JSON.parse(localStorage.getItem("user") || "{}");

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		window.location.href = "/login";
	};

	const fetchTasks = async () => {
		try {
			setIsLoading(true);
			const data = await getTasks();
			setTasks(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error("Error fetching tasks:", err);
			setError("Failed to load tasks");
			setTasks([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	const handleDelete = async (taskId) => {
		if (window.confirm("Are you sure you want to delete this task?")) {
			try {
				await deleteTask(taskId);
				await fetchTasks();
			} catch (err) {
				console.error("Error deleting task:", err);
			}
		}
	};

	const filteredTasks = tasks.filter(
		(task) =>
			task?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			task?.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const indexOfLastTask = currentPage * rowsPerPage;
	const indexOfFirstTask = indexOfLastTask - rowsPerPage;
	const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

	const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, rowsPerPage]);

	const handleRowsPerPageChange = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setCurrentPage(1);
	};

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-xl">Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-xl text-red-500">{error}</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow">
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-center h-16">
						<div className="flex flex-col">
							<h1 className="text-xl font-medium">Task Management System</h1>
							<span className="text-gray-600">Assalamualaikum, {user.name}</span>{" "}
						</div>
						<button
							onClick={handleLogout}
							className="border border-red-500 text-red-500 bg-white font-bold rounded-full px-4 py-2 text-sm hover:bg-red-500 hover:text-white transition duration-200"
						>
							Logout
						</button>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-6">
					<div className="flex items-center gap-4 w-full max-w-md">
						<input
							type="text"
							placeholder="Cari Data"
							className="w-full p-2 border rounded"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<button
							onClick={() => {
								setSelectedTask(null);
								setIsModalOpen(true);
							}}
							className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
						>
							Tambah Data
						</button>
					</div>
				</div>

				<div className="overflow-x-auto bg-white rounded-lg shadow">
					<table className="min-w-full table-fixed">
						<thead>
							<tr>
								<th className="w-16 px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
									No
								</th>
								<th className="w-1/5 px-16 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
									Tasklist
								</th>
								<th className="w-1/3 px-16 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
									Description
								</th>
								<th className="w-1/6 px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
									Deadline
								</th>
								<th className="w-1/6 px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="w-1/6 px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
									Aksi
								</th>
							</tr>
						</thead>
						<tbody className="bg-white">
							{currentTasks.map((task, index) => (
								<tr key={task.id}>
									<td className="px-6 py-4 whitespace-no-wrap border-b text-center border-gray-200">
										{indexOfFirstTask + index + 1}
									</td>
									<td className="px-6 py-4 whitespace-no-wrap border-b text-center border-gray-200">
										{task.title}
									</td>
									<td className="px-6 py-4 border-b text-center border-gray-200">
										{task.description}
									</td>
									<td className="px-6 py-4 whitespace-no-wrap border-b text-center border-gray-200">
										{task.deadline}
									</td>
									<td className="px-6 py-4 whitespace-no-wrap border-b text-center border-gray-200">
										<span
											className={`inline-block px-2 py-1 rounded ${
												task.status === "pending"
													? "bg-orange-200 px-5 rounded-full text-orange-800"
													: task.status === "in-progress"
													? "bg-blue-200 px-2 rounded-full text-blue-800"
													: task.status === "completed"
													? "bg-green-200 px-3 rounded-full text-green-800"
													: ""
											}`}
										>
											{task.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-no-wrap border-b text-center border-gray-200">
										<div className="flex gap-2">
											<button
												onClick={() => {
													setSelectedTask(task);
													setIsModalOpen(true);
												}}
												className="bg-yellow-600 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(task.id)}
												className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="flex flex-col md:flex-row items-center justify-between px-6 py-3 bg-gray border-t">
					<div className="flex items-center mb-3 md:mb-0">
						<span className="mr-2">Rows per page:</span>
						<select
							value={rowsPerPage}
							onChange={handleRowsPerPageChange}
							className="border rounded py-1"
						>
							<option value={10}>10</option>
							<option value={25}>25</option>
							<option value={50}>50</option>
							<option value={100}>100</option>
						</select>
					</div>

					<div className="flex items-center mb-3 md:mb-0">
						<span className="ml-4">
							{indexOfFirstTask + 1} -{" "}
							{Math.min(indexOfLastTask, filteredTasks.length)} of{" "}
							{filteredTasks.length}
						</span>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex gap-1">
							<button
								onClick={() => handlePageChange(1)}
								disabled={currentPage === 1}
								className={`px-4 py-2 text-lg font-semibold rounded ${
									currentPage === 1
										? "disabled:opacity-50 bg-gray-300"
										: "bg-blue-500 text-white hover:bg-blue-600"
								}`}
							>
								{"|<"}
							</button>
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className={`px-4 py-2 text-lg font-semibold rounded ${
									currentPage === 1
										? "disabled:opacity-50 bg-gray-300"
										: "bg-blue-500 text-white hover:bg-blue-600"
								}`}
							>
								{"<"}
							</button>
							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className={`px-4 py-2 text-lg font-semibold rounded ${
									currentPage === totalPages
										? "disabled:opacity-50 bg-gray-300"
										: "bg-blue-500 text-white hover:bg-blue-600"
								}`}
							>
								{">"}
							</button>
							<button
								onClick={() => handlePageChange(totalPages)}
								disabled={currentPage === totalPages}
								className={`px-4 py-2 text-lg font-semibold rounded ${
									currentPage === totalPages
										? "disabled:opacity-50 bg-gray-300"
										: "bg-blue-500 text-white hover:bg-blue-600"
								}`}
							>
								{">|"}
							</button>
						</div>
					</div>
				</div>
			</div>

			<TaskModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				task={selectedTask}
				onSuccess={() => {
					fetchTasks();
					setIsModalOpen(false);
				}}
			/>
		</div>
	);
}
