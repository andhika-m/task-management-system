import React, { useState, useEffect } from "react";
import { createTask, updateTask } from "../utils/fetch";

export default function TaskModal({ isOpen, onClose, task, onSuccess }) {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		deadline: "",
		status: "pending",
	});

	useEffect(() => {
		if (task) {
			setFormData(task);
		} else {
			setFormData({
				title: "",
				description: "",
				deadline: "",
				status: "pending",
			});
		}
	}, [task]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (task) {
				await updateTask(task.id, formData);
			} else {
				await createTask(formData);
			}
			onSuccess();
		} catch (error) {
			console.error("Error saving task:", error);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">
						{task ? "Edit Task" : "Tambah Task"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block mb-2">Tasklist</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					<div className="mb-4">
						<label className="block mb-2">Description</label>
						<textarea
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					<div className="mb-4">
						<label className="block mb-2">Deadline</label>
						<input
							type="date"
							value={formData.deadline}
							onChange={(e) =>
								setFormData({ ...formData, deadline: e.target.value })
							}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					<div className="mb-4">
						<label className="block mb-2">Status</label>
						<select
							value={formData.status}
							onChange={(e) =>
								setFormData({ ...formData, status: e.target.value })
							}
							className="w-full p-2 border rounded"
						>
							<option value="pending">Pending</option>
							<option value="in-progress">In Progress</option>
							<option value="completed">Completed</option>
						</select>
					</div>

					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border rounded"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							{task ? "Update" : "Save"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
