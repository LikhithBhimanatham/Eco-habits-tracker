
import { useState } from "react";
import { Bell } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { NotificationCard, Notification } from "@/components/notifications/notification-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Notifications = () => {
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Time to scan your water bill",
      message: "It's been 30 days since your last water bill scan. Keep your tracking streak going!",
      type: "reminder",
      date: "2 hours ago",
      read: false
    },
    {
      id: "2",
      title: "Electricity Savings Achievement",
      message: "Congratulations! You've reduced your electricity consumption by 15% this month.",
      type: "achievement",
      date: "Yesterday",
      read: false
    },
    {
      id: "3",
      title: "Water Conservation Tip",
      message: "Install low-flow showerheads to save up to 2,700 gallons of water per year.",
      type: "tip",
      date: "2 days ago",
      read: true
    },
    {
      id: "4",
      title: "You're in the Top 10!",
      message: "Your eco efforts have placed you in the top 10 on the weekly leaderboard!",
      type: "achievement",
      date: "3 days ago",
      read: true
    },
    {
      id: "5",
      title: "Fuel Efficiency Tip",
      message: "Avoid rapid acceleration and braking to improve your vehicle's fuel efficiency by up to 33%.",
      type: "tip",
      date: "5 days ago",
      read: true
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar className="hidden md:flex" />
      
      <main className="flex-1 pt-6 px-4 pb-20 md:pb-6 md:pl-24">
        <div className="max-w-3xl mx-auto">
          <header className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              </div>
              
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
            <p className="text-gray-600 mt-2">Stay updated with reminders, achievements and eco tips</p>
          </header>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="all" className="flex-1">
                All
                {unreadCount > 0 && <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">{unreadCount}</span>}
              </TabsTrigger>
              <TabsTrigger value="reminders" className="flex-1">Reminders</TabsTrigger>
              <TabsTrigger value="achievements" className="flex-1">Achievements</TabsTrigger>
              <TabsTrigger value="tips" className="flex-1">Eco Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                    <p className="text-gray-500">You're all caught up!</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reminders">
              <div className="space-y-4">
                {notifications.filter(n => n.type === "reminder").length > 0 ? (
                  notifications
                    .filter(n => n.type === "reminder")
                    .map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No reminders</h3>
                    <p className="text-gray-500">You're all caught up with your habits!</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="achievements">
              <div className="space-y-4">
                {notifications.filter(n => n.type === "achievement").length > 0 ? (
                  notifications
                    .filter(n => n.type === "achievement")
                    .map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No achievements yet</h3>
                    <p className="text-gray-500">Keep tracking your habits to earn achievements!</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="tips">
              <div className="space-y-4">
                {notifications.filter(n => n.type === "tip").length > 0 ? (
                  notifications
                    .filter(n => n.type === "tip")
                    .map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No eco tips</h3>
                    <p className="text-gray-500">Check back later for helpful eco tips!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Navbar className="md:hidden" />
    </div>
  );
};

export default Notifications;
