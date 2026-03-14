import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContextValue";
import { useModal } from "../../../contexts/useModal";
import Button from "../../../components/button/Button";
import LoadingIcon from "../../../assets/icons/loadingIcon";
import { TrashBin2, LockPassword, Letter } from "@solar-icons/react";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/input/Input";
import ThemeSelector from "../../../components/themeSelector/themeSelector";

type Section = "appearance" | "security" | "danger";

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: "appearance", label: "Appearance" },
  { id: "security", label: "Security" },
  { id: "danger", label: "Danger Zone" },
];

export default function Settings() {
  const { user, updateUser, deleteAccount, loading } = useContext(AuthContext);
  const { showModal } = useModal();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("appearance");

  // Security form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  // Danger zone
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      await showModal({ title: "Mismatch", message: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      await showModal({ title: "Too Short", message: "Password must be at least 6 characters." });
      return;
    }
    setSavingPassword(true);
    try {
      await updateUser({ password: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await showModal({ title: "Success", message: "Password updated successfully." });
    } catch {
      // error handled by AuthContext toast
    } finally {
      setSavingPassword(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || newEmail === user?.email) {
      await showModal({ title: "No Change", message: "Please enter a different email address." });
      return;
    }
    setSavingEmail(true);
    try {
      await updateUser({ email: newEmail });
      setNewEmail("");
      await showModal({ title: "Success", message: "Email updated successfully." });
    } catch {
      // error handled by AuthContext toast
    } finally {
      setSavingEmail(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmed = await showModal({
      title: "Delete Account",
      message: "This will permanently delete your account, all your leads, and profile data.\n\nThis action cannot be undone. Are you absolutely sure?",
      showCancel: true,
    });
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteAccount(deletePassword);
      navigate("/");
    } catch {
      // error handled by AuthContext toast
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="uppercase font-medium mb-1">Settings</h1>
        <p className="opacity-[0.6] ">Manage your account preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:p-6 rounded-lg md:border border-gray/[0.1] bg-gray/[0.02] dark:bg-gray/[0.07]">
        {/* Sidebar nav */}
        <nav className="md:w-64 flex md:flex-col flex-row gap-1 shrink-0">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`text-left px-3 py-2 rounded-lg  font-medium transition-colors ${
                activeSection === item.id
                  ? "bg-background text-text"
                  : "opacity-[0.6] hover:bg-gray/[0.08]"
              } ${item.id === "danger" ? "text-red-600 hover:bg-red-50 hover:text-red-600" : ""} ${
                activeSection === "danger" && item.id === "danger" ? "!bg-red-600 text-white" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1">
          {/* Appearance */}
          {activeSection === "appearance" && (
            <div className="bg-background border border-gray/[0.2] rounded-xl p-6 flex flex-col gap-6">
              <div>
                <h2 className="font-semibold mb-1">Theme</h2>
                <p className=" opacity-[0.6] mb-4">Choose how Flashleads looks for you</p>
                <ThemeSelector />
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <div className="flex flex-col gap-4">
              {/* Change email */}
              <div className="bg-background border border-gray/[0.2] rounded-xl p-6">
                <h2 className="font-semibold mb-1 flex items-center gap-2">
                  <Letter size={18} /> Change Email
                </h2>
                <p className=" opacity-[0.6] mb-4">Current: <span className="font-medium">{user?.email}</span></p>
                <form onSubmit={handleChangeEmail} className="flex flex-col gap-3 max-w-sm">
                  <Input
                    type="email"
                    placeholder="New email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={savingEmail || loading} className="w-fit">
                    {savingEmail ? <><LoadingIcon /> Saving...</> : "Update Email"}
                  </Button>
                </form>
              </div>

              {/* Change password */}
              <div className="bg-background border border-gray/[0.2] rounded-xl p-6">
                <h2 className="font-semibold mb-1 flex items-center gap-2">
                  <LockPassword size={18} /> Change Password
                </h2>
                <p className=" opacity-[0.6] mb-4">Choose a strong password with at least 6 characters</p>
                <form onSubmit={handleChangePassword} className="flex flex-col gap-3 max-w-sm">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={savingPassword || loading} className="w-fit">
                    {savingPassword ? <><LoadingIcon /> Saving...</> : "Update Password"}
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === "danger" && (
            <div className="bg-background border border-gray/[0.2] rounded-xl p-6">
              <h2 className="font-semibold text-red-600 mb-1 flex items-center gap-2">
                <TrashBin2 size={18} /> Delete Account
              </h2>
              <p className=" opacity-[0.6] mb-4">
                Permanently delete your account and all associated data including leads and profile. This action
                <span className="font-semibold text-red-600"> cannot be undone</span>.
              </p>
              <form onSubmit={handleDeleteAccount} className="flex flex-col gap-3">
                <Input
                  type="password"
                  placeholder="Enter your password to confirm"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={deleting || !deletePassword}
                  className="w-fit px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg  font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleting ? <><LoadingIcon /> Deleting...</> : <><TrashBin2 size={16} /> Delete My Account</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
