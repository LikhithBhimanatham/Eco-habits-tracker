
import { useProfileForm } from "@/hooks/use-profile-form";
import { CurrentUserDisplay } from "./current-user-display";
import { UserActionButtons } from "./user-action-buttons";
import { CreateProfileForm } from "./create-profile-form";

export function UserProfileForm() {
  const { 
    form, 
    isLoggedIn, 
    currentUser, 
    creatingNew, 
    isSubmitting, 
    onSubmit, 
    handleLogout, 
    handleCreateNew, 
    handleCancel 
  } = useProfileForm();

  return (
    <div className="space-y-6 max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <div>
        <h2 className="text-2xl font-bold">
          {creatingNew ? "Create New User" : isLoggedIn ? "Your Profile" : "Create Profile"}
        </h2>
        <p className="text-muted-foreground">
          {creatingNew 
            ? "Set up a new account to track your utility usage" 
            : isLoggedIn 
              ? "Manage your account details and notification preferences"
              : "Set up your account to track your utility usage"
          }
        </p>
      </div>
      
      {isLoggedIn && !creatingNew && currentUser && (
        <CurrentUserDisplay currentUser={currentUser} />
      )}
      
      {isLoggedIn && !creatingNew && (
        <UserActionButtons 
          onCreateNew={handleCreateNew}
          onLogout={handleLogout}
        />
      )}
      
      {(creatingNew || !isLoggedIn) && (
        <CreateProfileForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          creatingNew={creatingNew}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
