
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ProfileFormFields } from "./profile-form-fields";
import { ProfileFormValues } from "./types";
import { UseFormReturn } from "react-hook-form";

interface CreateProfileFormProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  isSubmitting: boolean;
  creatingNew: boolean;
  onCancel: () => void;
}

export function CreateProfileForm({ 
  form, 
  onSubmit, 
  isSubmitting, 
  creatingNew, 
  onCancel 
}: CreateProfileFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProfileFormFields form={form} />
        
        <div className="flex justify-between">
          <Button 
            type="submit" 
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? creatingNew ? "Creating..." : "Creating Profile..." 
              : creatingNew ? "Create User" : "Create Profile"}
          </Button>
          
          {creatingNew && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
