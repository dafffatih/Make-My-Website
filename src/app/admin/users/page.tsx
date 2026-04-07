"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  _count: { projects: number };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode: "create" | "edit", user: User | null = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    if (user && mode === "edit") {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // Leave blank for edit unless changing
        role: user.role
      });
    } else {
      setFormData({ name: "", email: "", password: "", role: "customer" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = modalMode === "create" ? "/api/admin/users" : `/api/admin/users/${selectedUser?.id}`;
      const method = modalMode === "create" ? "POST" : "PUT";
      
      const payload: any = { ...formData };
      if (modalMode === "edit" && !payload.password) {
        delete payload.password; // Don't send empty password on edit
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save user");
      }

      await fetchUsers();
      closeModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string | null) => {
    if (!confirm(`Are you sure you want to delete user ${name || id}? This will also delete their projects and chat history.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }
      setUsers(users.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mt-20"></div></div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">User Management</h2>
          <p className="text-on-surface-variant text-sm">Manage customers and admin accounts.</p>
        </div>
        <button
          onClick={() => handleOpenModal("create")}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add User
        </button>
      </div>

      {error ? (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">{error}</div>
      ) : (
        <div className="bg-surface-container border border-outline-variant/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 text-on-surface-variant text-sm border-b border-outline-variant/10">
                  <th className="py-4 px-6 font-semibold">User</th>
                  <th className="py-4 px-6 font-semibold">Role</th>
                  <th className="py-4 px-6 font-semibold">Projects</th>
                  <th className="py-4 px-6 font-semibold">Joined</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-outline-variant/10 hover:bg-surface-container-high/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-sm">
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{user.name || "Unknown"}</div>
                          <div className="text-on-surface-variant text-sm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {user._count.projects}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant text-sm">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal("edit", user)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-surface-container-highest transition-colors"
                          title="Edit User"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          title="Delete User"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 block text-left">
            <div className="px-6 py-5 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                {modalMode === "create" ? "Create New User" : "Edit User"}
              </h3>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant">
                  Password {modalMode === "edit" && <span className="text-xs font-normal opacity-70">(Leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  required={modalMode === "create"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant/30 text-white font-semibold hover:bg-surface-container-highest transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
