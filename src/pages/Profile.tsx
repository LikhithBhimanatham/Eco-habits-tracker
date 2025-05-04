
import { UserProfileForm } from "@/components/user/user-profile-form";
import { Navbar } from "@/components/ui/navbar";

const Profile = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar className="hidden md:flex" />
      
      <main className="flex-1 pt-6 px-4 pb-20 md:pb-6 md:pl-24">
        <div className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Account Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account and notification preferences</p>
          </header>
          
          <UserProfileForm />
        </div>
      </main>
      
      <Navbar className="md:hidden" />
    </div>
  );
};

export default Profile;
