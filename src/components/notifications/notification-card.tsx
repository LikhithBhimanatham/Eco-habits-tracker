
import { Bell, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "reminder" | "achievement" | "tip";
  date: string;
  read: boolean;
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  className?: string;
}

export function NotificationCard({ 
  notification, 
  onMarkAsRead, 
  className 
}: NotificationCardProps) {
  const typeStyles = {
    reminder: "bg-blue-50 border-blue-200",
    achievement: "bg-green-50 border-green-200",
    tip: "bg-amber-50 border-amber-200"
  };
  
  const badgeStyles = {
    reminder: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    achievement: "bg-green-100 text-green-800 hover:bg-green-200",
    tip: "bg-amber-100 text-amber-800 hover:bg-amber-200"
  };
  
  return (
    <Card 
      className={cn(
        "border-l-4 transition-all", 
        notification.read ? "bg-gray-50 border-gray-200" : typeStyles[notification.type],
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`text-sm font-medium ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                {notification.title}
              </h4>
              <Badge variant="outline" className={badgeStyles[notification.type]}>
                {notification.type === "reminder" 
                  ? "Reminder" 
                  : notification.type === "achievement" 
                  ? "Achievement" 
                  : "Eco Tip"}
              </Badge>
            </div>
            <p className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-700"}`}>
              {notification.message}
            </p>
            <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
          </div>
          
          {!notification.read && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Mark as read</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
