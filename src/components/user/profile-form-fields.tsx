
import { User, Mail, KeyRound } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function ProfileFormFields({ form }: ProfileFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Enter your username" 
                  className="pl-10" 
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              Used for bill notifications and updates
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="notifications"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <div className="h-4 w-4">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Receive email notifications</FormLabel>
              <FormDescription>
                Get updates about bill due dates and conservation tips
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}
